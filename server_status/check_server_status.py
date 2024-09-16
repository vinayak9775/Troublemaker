# check_server_status.py
import requests
import time

def check_server_status(server_url):
    while True:
        try:
            response = requests.get(server_url)
            if response.status_code == 200:
                print('Django development server is running.')
            else:
                print('Django development server is not running.')
        except requests.ConnectionError:
            print('Django development server is not reachable.')

        time.sleep(5)  # Adjust the interval as needed

if __name__ == "__main__":
    # Update with your Django development server's URL
    server_url = 'http://192.168.0.109:8000/'
    check_server_status(server_url)
