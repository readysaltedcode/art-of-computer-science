// Pulse width modulation effect (Breathing)
// Loading onto the GEMMA
//Step one Select Tools > Board > Gemma Board
//Step two Select Tools > Programmer > TinyISP
//Step three Press the balck button on the Gemma - you must upload sketch within 10 seconds
// Step four upload sketch


#include <Adafruit_NeoPixel.h>

#define PIN 1

Adafruit_NeoPixel strip = Adafruit_NeoPixel(7, PIN, NEO_GRB + NEO_KHZ800);

void setup() {
  strip.begin();
  strip.show(); 
}

void loop() {
  colorWipe(strip.Color(0, 0, 200), 200); //Blue
  theaterChase(strip.Color(  0,   0, 127), 100); // Blue
  colorWipe(strip.Color(0, 0, 200), 50);
  
}
// Fill the dots one after the other with a color
void colorWipe(uint32_t c, uint8_t wait) {
  for(uint16_t i=0; i<strip.numPixels(); i++) {
      strip.setPixelColor(i, c);
      strip.show();
      delay(wait);
  }
}

// twinkle pattern
//Theatre-style crawling lights.
void theaterChase(uint32_t c, uint8_t wait) {
  for (int j=0; j<10; j++) {  //do 10 cycles of chasing
    for (int q=0; q < 3; q++) {
      for (int i=0; i < strip.numPixels(); i=i+3) {
        strip.setPixelColor(i+q, c);    //turn every third pixel on
      }
      strip.show();
     
      delay(wait);
     
      for (int i=0; i < strip.numPixels(); i=i+3) {
        strip.setPixelColor(i+q, 0);        //turn every third pixel off
      }
    }
  }
}


