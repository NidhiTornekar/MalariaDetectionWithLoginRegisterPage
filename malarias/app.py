from flask import Flask, request,jsonify
from keras.models import load_model
from PIL import Image
import numpy as np
from flask_cors import CORS,cross_origin
import base64
import os
from dotenv import load_dotenv
from pymongo import MongoClient

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])
model = load_model("C:\\Users\\nidhi\\OneDrive\\Desktop\\otp\\malarias\\malaria_cnn_model.h5")
load_dotenv()
mongo_uri = os.getenv('MONGO_URI')
mongo_client = MongoClient(mongo_uri)

db = mongo_client['test']
collection = db['cellimages']

def preprocess_image(image):
    image = image.resize((50, 50))
    image_array = np.array(image)
    image_array = image_array / 255.0
    image_array = np.expand_dims(image_array, axis=0)
    return image_array
@app.route("/past-predictions", methods=["POST"])
def get_past_predictions():
    email=request.form["email"]
    #email = request.json["email"]
    result = collection.find({"email": email}, {"_id": 0, "image_b64": 1, "predicted": 1, "actual": 1})
    return jsonify(list(result))
@app.route("/store-image", methods=["POST"])
def store_image():
  img_b64 = request.files["image_b64"].read()
  prediction = request.form["predicted"]
  truth = request.form["actual"]
  mail=request.form["email"]
  db_result = collection.insert_one({
    'email':mail,
    'image': img_b64,
    'predicted': prediction,
    'actual': truth,
    'image_b64': base64.b64encode(img_b64).decode('utf-8')
  })
  print(db_result)
  return jsonify({"message": "Image stored successfully!"})
@app.route("/predict", methods=["POST"])
@cross_origin()
def predict():
    imagefile = request.files["imagefile"]
    image = Image.open(imagefile)
    image_array = preprocess_image(image)
    pred = model.predict(image_array)
    print(pred[0][0])
    if(pred[0][0]>=0.5):
      return "parasitized"
    else: 
       return "uninfected"
    # return str(pred[0][0])
    

if __name__ == "__main__":
    app.run(debug=True)