import requests
from .document import DownloadError

def pdf_to_image(pdf_url):
    response = requests.get(pdf_url)
    if response.status_code != 200:
        raise DownloadError(response.text)
        
    return response.content

