import requests

API_KEY = "clase_pokemon_2024"
BASE_URL = "https://aronunisur.pythonanywhere.com/pokemon"

print("=" * 60)
print(" LOS 150 POKEMON DE PRIMERA GENERACION ")
print("=" * 60)

contador = 0
for numero in range(1, 151):  # Del 1 al 150
    URL = f"{BASE_URL}/{numero}?api_key={API_KEY}"
    
    try:
        response = requests.get(URL)
        
        if response.status_code == 200:
            data = response.json()
            print(f"#{data['id']:03d} - {data['nombre']:12} | Tipo: {data['tipo']:10} | Peso: {data['peso_kg']:5.1f} kg | Altura: {data['altura_m']:3.1f} m")
            contador += 1
        else:
            print(f"#{numero:03d} - ERROR: No encontrado")
            
    except Exception as e:
        print(f"#{numero:03d} - ERROR: {e}")

print("=" * 60)
print(f" TOTAL: {contador} pokemon mostrados")
print("=" * 60)