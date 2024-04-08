import os
import pandas as pd
import numpy as np
from django.http import JsonResponse
from sklearn.linear_model import LinearRegression
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response
from django.db import connection

@api_view(['GET'])
def predict_for_next_100_days(request):
    if request.method == 'GET':
        try:
            current_dir = os.path.dirname(os.path.abspath(__file__))
            
            csv_file_path = os.path.join(current_dir, 'Car.csv')
            
            df = pd.read_csv(csv_file_path)
            
            # Data Cleaning
            imputer = SimpleImputer(strategy='mean')
            scaler = StandardScaler()

            df[['Engine_size', 'Horsepower', 'Fuel_efficiency', 'sales']] = scaler.fit_transform(imputer.fit_transform(df[['Engine_size', 'Horsepower', 'Fuel_efficiency', 'sales']]))

            X_train = df[['Engine_size', 'Horsepower', 'Fuel_efficiency', 'sales']].values
            y_train = df['Price_in_thousands'].values

            imputer_y = SimpleImputer(strategy='mean')
            y_train = imputer_y.fit_transform(y_train.reshape(-1, 1)).ravel()

            model = LinearRegression()
            model.fit(X_train, y_train)

            future_features = []
            horsepower = 200 
            
            for i in range(50):
                
                engine_size = max(1, abs(np.random.uniform(2.0, 6.0) * (1 + np.random.normal(scale=0.1))))  
                fuel_efficiency = np.random.uniform(20, 60) * (1 + np.random.normal(scale=0.1))
                sales = np.random.randint(800, 1201) * (1 + np.random.normal(scale=0.1))

                horsepower_variation = np.random.uniform(-2, 2)
                horsepower += 5 + horsepower_variation 

                horsepower = max(min(horsepower, 400), 200)
                
                future_features.append([engine_size, horsepower, fuel_efficiency, sales])
            
            future_features = imputer.transform(future_features)
            future_features = scaler.transform(future_features)
            
            predicted_prices = model.predict(future_features)

            valid_predicted_data = []

            for price, features in zip(predicted_prices, future_features):
                if price >= 0:
                    valid_predicted_data.append({
                        'Price': round(price, 4),
                        'Engine_size': round(features[0], 4),
                        'Horsepower': round(features[1], 4),
                        'Fuel_efficiency': round(features[2], 4),
                        'Sales': round(features[3], 4)
                    })

            return Response(valid_predicted_data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

@api_view(['POST'])
def login(request):
    if request.method == 'POST':
        username = request.data.get('username')
        password = request.data.get('password')
        if username and password:
            query = """
                SELECT * FROM api_users
                WHERE username = %s AND password = %s
            """
            params = [username, password]
            try:
                with connection.cursor() as cursor:
                    cursor.execute(query, params)
                    result = cursor.fetchone()
                    if result:
                        request.session['username'] = username
                        request.session.set_expiry(60*60*2) 
                        print("Session Data:", request.session)
                        return JsonResponse({'status': True, 'username': username})
                    else:
                        return JsonResponse({'status': False}, status=status.HTTP_401_UNAUTHORIZED)
            except Exception as e:
                return JsonResponse({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return JsonResponse({'error': 'Missing required fields.'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return JsonResponse({'error': 'Invalid request method.'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
