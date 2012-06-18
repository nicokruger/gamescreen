VERSION = 0.0.1
LIB = dist/gamescreen-$(VERSION).js

SCRIPTS = backingCanvas.js fullCanvas.js scrollingCanvas.js util.js console.js gamescreen.js transform.js
$(LIB): $(SCRIPTS)
	mkdir -p dist
	rm -rf .lib.tmp
	for F in $(SCRIPTS); do cat $$F >> .lib.tmp;done
	mv .lib.tmp $(LIB)

all: $(LIB)

clean:
	rm $(LIB)
