/*
  =============================================================================
  PowerPulse — ESP32 + PZEM-004T v3.0 AWS IoT Core Telemetry Publisher
  =============================================================================
  Hardware Connections:
    - ESP32 TX2 (GPIO 17) -> PZEM-004T RX
    - ESP32 RX2 (GPIO 16) -> PZEM-004T TX
    - ESP32 5V & GND     -> PZEM-004T VCC & GND

  Required Arduino Libraries (Install via Library Manager):
    1. PZEM-004T v3.0 by Jakub Maćkowiak (PZEM004Tv30.h)
    2. PubSubClient by Nick O'Leary (PubSubClient.h)
    3. ArduinoJson by Benoit Blanchon (ArduinoJson.h)
  =============================================================================
*/

#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include <PZEM004Tv30.h>
#include <ArduinoJson.h>

// 1. Wi-Fi Configuration
const char* WIFI_SSID = "YOUR_WIFI_SSID";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";

// 2. AWS IoT Core Configuration
const char* AWS_IOT_ENDPOINT = "YOUR_AWS_IOT_ENDPOINT.iot.ap-south-1.amazonaws.com"; // e.g. a1b2c3d4e5f6g7-ats.iot.ap-south-1.amazonaws.com
const char* DEVICE_ID = "SmartEnergyMeter01";
const char* AWS_MQTT_TOPIC = "smartenergymeter/pub";

// 3. AWS IoT Certificates (Copy from AWS IoT Core -> Things -> Certificates)

// Amazon Root CA 1
const char AWS_CERT_CA[] PROGMEM = R"EOF(
-----BEGIN CERTIFICATE-----
... PASTE YOUR AMAZON ROOT CA 1 HERE ...
-----END CERTIFICATE-----
)EOF";

// ESP32 Device Certificate (xxxxxxxxx-certificate.pem.crt)
const char AWS_CERT_CRT[] PROGMEM = R"EOF(
-----BEGIN CERTIFICATE-----
... PASTE YOUR ESP32 DEVICE CERTIFICATE HERE ...
-----END CERTIFICATE-----
)EOF";

// ESP32 Private Key (xxxxxxxxx-private.pem.key)
const char AWS_CERT_PRIVATE[] PROGMEM = R"EOF(
-----BEGIN RSA PRIVATE KEY-----
... PASTE YOUR ESP32 PRIVATE KEY HERE ...
-----END RSA PRIVATE KEY-----
)EOF";

// Hardware Serial 2 pins for PZEM-004T (RX2 = GPIO 16, TX2 = GPIO 17)
#define PZEM_RX_PIN 16
#define PZEM_TX_PIN 17

PZEM004Tv30 pzem(Serial2, PZEM_RX_PIN, PZEM_TX_PIN);
WiFiClientSecure net = WiFiClientSecure();
PubSubClient client(net);

void connectToWiFi() {
  Serial.print("Connecting to Wi-Fi: ");
  Serial.println(WIFI_SSID);
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWi-Fi Connected!");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
}

void connectToAWS() {
  net.setCACert(AWS_CERT_CA);
  net.setCertificate(AWS_CERT_CRT);
  net.setPrivateKey(AWS_CERT_PRIVATE);

  client.setServer(AWS_IOT_ENDPOINT, 8883);

  Serial.println("Connecting to AWS IoT Core...");
  while (!client.connected()) {
    if (client.connect(DEVICE_ID)) {
      Serial.println("AWS IoT Core Connected!");
    } else {
      Serial.print("AWS Connection Failed, rc=");
      Serial.print(client.state());
      Serial.println(" Retrying in 5 seconds...");
      delay(5000);
    }
  }
}

void publishTelemetry() {
  // Read sensor values from PZEM-004T
  float voltage = pzem.voltage();
  float current = pzem.current();
  float power = pzem.power();
  float energy = pzem.energy();
  float frequency = pzem.frequency();
  float pf = pzem.pf();

  // Check if readings are valid numbers
  if (isnan(voltage)) voltage = 0.0;
  if (isnan(current)) current = 0.0;
  if (isnan(power)) power = 0.0;
  if (isnan(energy)) energy = 0.0;
  if (isnan(frequency)) frequency = 50.0;
  if (isnan(pf)) pf = 0.95;

  // Build JSON payload
  StaticJsonDocument<256> doc;
  doc["device_id"] = DEVICE_ID;
  doc["voltage"] = voltage;
  doc["current"] = current;
  doc["power"] = power;
  doc["energy"] = energy;
  doc["frequency"] = frequency;
  doc["power_factor"] = pf;

  char jsonBuffer[512];
  serializeJson(doc, jsonBuffer);

  Serial.print("Publishing to AWS IoT Topic ");
  Serial.print(AWS_MQTT_TOPIC);
  Serial.print(": ");
  Serial.println(jsonBuffer);

  client.publish(AWS_MQTT_TOPIC, jsonBuffer);
}

void setup() {
  Serial.begin(115200);
  delay(1000);

  Serial.println("\n=================================");
  Serial.println("PowerPulse ESP32 PZEM AWS IoT Initializing...");
  Serial.println("=================================");

  connectToWiFi();
  connectToAWS();
}

void loop() {
  if (WiFi.status() != WL_CONNECTED) {
    connectToWiFi();
  }
  if (!client.connected()) {
    connectToAWS();
  }
  client.loop();

  publishTelemetry();
  delay(3000); // Send reading every 3 seconds
}
