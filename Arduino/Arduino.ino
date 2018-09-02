#include <Ethernet.h>

// The mac address for the arduino
byte mac[] = {};
// Set the static IP address to use if the DHCP fails to assign
IPAddress ip();
// The Node.js server address, in this case local
char serverName[] = "";
// The server port
int serverPort = 3000;

// The path where the server should get the request
char temperatureEndpoint[] = "/temperature";
char alarmEndpoint[] = "/alarm";
char detectedEndpoint[] = "/detected";
char heartbeatEndpoint[]= "/heartbeat";

// The necessary  IO pins
int analogVoltageTempPin0= 0;
int inputButtonPin = 12;
int LED = 13;
int inputPIRSensorPin = 2;

EthernetClient client;
// We must insure params is big enough to hold the variables, this is used for encoding in the HTTP requests
char params[32];

// the delay between requests for temperature, currently set to 5s
#define temperatureDelayMillis 5000UL
// the delay between requests for heartbeat, currently set to 5s
#define heartBeatDelayMillis 5000UL
unsigned long thisMillis = 0;
unsigned long lastMillis = 0;
unsigned long lastHeartBeat = 0;
int alarmArmCounter = 0;

int alarmValue = 0;

void setup() {
  Serial.begin(9600);
  //setting the corect pinmodes in case there is an sd card present
  // pinMode(4,OUTPUT);
  // digitalWrite(4,HIGH);

  pinMode(inputButtonPin, INPUT_PULLUP);
  pinMode(LED, OUTPUT);
  pinMode(inputPIRSensorPin, INPUT);

  Serial.println(F("Starting ethernet..."));
  Ethernet.begin(mac, ip);
  
  if(false) {
    Serial.println(F("failed"));
  }
  else {
    Serial.print(F("Shield\'s IP: "));
    Serial.println(Ethernet.localIP());
  }
//0.5s delay before sending data
  delay(500);
  Serial.println(F("Ready"));
}

void loop()
{
  //in case of using dynamic ip we need the next line
  Ethernet.maintain();
  thisMillis = millis();

  // Record temperature
  if(thisMillis - lastMillis > temperatureDelayMillis)
  {
    lastMillis = thisMillis;
    //To calculate the temp we read the analog pin, we divide it by 1024 because 5V is occupied by a span of 1024
    //After we get the ratio of the raw value we multiply it by 5000 to get the milivolt value, in my case I have
    //multiplied it by 4970 because I measured the arduino 5V output and it in fact gives out 4.97V
    float millivolts= (analogRead(analogVoltageTempPin0)/1024.0) * 4970;
    //The LM335 sensor is mainly used to measure in kelvin, the output will be 10 milivolts per kelvin temp
    //I then substracted 273.15 to convert from kelvin to celsius
    float celsius= (millivolts/10) - 273.15;
    // The params are url encoded
    sprintf(params, "temp=%f", celsius);
    Serial.println();
    Serial.println(F("Sending temperature..."));
    Serial.println(celsius);
    if(!postPage(serverName, serverPort, temperatureEndpoint, params)){ Serial.println(F("Fail "));}
    else {Serial.print(F("Temperature sent."));}
  }

    int previousAlarmValue = alarmValue;
    int buttonValue = !digitalRead(inputButtonPin);
    if (buttonValue == HIGH){
      if(alarmArmCounter <11){
        alarmArmCounter++;
        }
      if(alarmArmCounter == 10){
      // If button pushed, turn LED on
      digitalWrite(LED,HIGH);
      alarmArmCounter++;
      alarmValue=1;
        }
   } else {
      // Otherwise, turn the LED off
      digitalWrite(LED, LOW);
      alarmArmCounter = 0;
      alarmValue=0;
   }

  // Alarm status
  if(previousAlarmValue != alarmValue)
  {
    // The params are url encoded
    sprintf(params, "alarm=%i", alarmValue);
    Serial.println();   
    Serial.println(F("Sending alarm status..."));
    if(!postPage(serverName, serverPort, alarmEndpoint, params)){ Serial.println(F("Fail "));}
    else {Serial.print(F("Alarm status sent."));}
  }
  // Detected status
  int detectedValue = digitalRead(inputPIRSensorPin);
  if(alarmValue == 1 && detectedValue == 1)
  {
    // The params are url encoded
    sprintf(params, "detected=%i", detectedValue);
    Serial.println();
    Serial.println(F("Sending detected status..."));
    if(!postPage(serverName, serverPort, detectedEndpoint, params)){ Serial.println(F("Fail "));}
    else {Serial.print(F("Detected status sent."));}
  }

  // Heartbeat status
  if (thisMillis - lastHeartBeat > heartBeatDelayMillis)
  {
    lastHeartBeat = thisMillis;
    Serial.println();
    Serial.println(F("Sending heartbeat..."));
    if(!postPage(serverName, serverPort, heartbeatEndpoint,"")){ Serial.println(F("Fail "));}
    else {Serial.print(F("Heartbeat sent."));}
  }
  delay(1000);
}

byte postPage(char* domainBuffer,int thisPort,char* page,char* thisData)
{
  int inChar;
  char outBuf[64];

  Serial.println();
  Serial.print(F("Sending a POST..."));

  if(client.connect(domainBuffer,thisPort) == 1)
  {

    Serial.print(F("connected..."));

    // Send the header
    sprintf(outBuf,"POST %s HTTP/1.1",page);
    client.println(outBuf);
    sprintf(outBuf,"Host: %s",domainBuffer);
    client.println(outBuf);
    client.println(F("Connection: close\r\nContent-Type: application/x-www-form-urlencoded"));
    sprintf(outBuf,"Content-Length: %u\r\n",strlen(thisData));
    client.println(outBuf);
    //send the body (variables)
    client.print(thisData);
     Serial.print(F("sent."));
  }
  else
  {
    Serial.print(F("failed."));
    return 0;
  }

  int connectLoop = 0;
  Serial.println();
  Serial.println(F("Response: "));
  
  while(client.connected())
  {
    while(client.available())
    {
      inChar = client.read();
      Serial.write(inChar);
      connectLoop = 0;
    }
    delay(1);
    client.stop();
  }

  Serial.print(F("disconnecting."));
  Serial.println();
  client.stop();
  return 1;
}
