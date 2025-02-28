import http.client
import json
conn = http.client.HTTPSConnection("xl6mjq.api-in.infobip.com")
payload = json.dumps({
    "from": "+447860099299",#447860099299
    "to": "+919834662802",
    "messageId": "a28dd97c-1ffb-4fcf-99f1-0b557ed381da",
    "content": {
        "text": "Some text"
    },
    "callbackData": "Callback data",
    "notifyUrl":"https://www.example.com/whatsapp"
})
headers = {
    'Authorization':'App af099554a7f804d8fd234e3226241101-da0d6970-19a8-4e0a-9154-9da1fb64d858',
    'Content-Type': 'application/json',
    'Accept': 'application/json'
}
conn.request("POST", "/whatsapp/1/message/text", payload, headers)
res = conn.getresponse()
data = res.read()
print(data.decode("utf-8"))
							