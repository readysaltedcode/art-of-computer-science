
// Workaround so that our fetcher can receive static JSONP data
// Not very OO
var STATIC_CHUNK_LISTENER = undefined;

function ChunkReceived(json) {
	if (STATIC_CHUNK_LISTENER) {
		STATIC_CHUNK_LISTENER(json);
	}
}

function ChunkedDataFetcher(dataUrlPrefix) {
	
	HEADSTART = 5000; // ms before trying to start drawing (ms)
	FRAMERATE = 40; // default frame rate (ms)
	
	FRAMES = [];
	LATEST_FRAME_GOT = -1;
	LATEST_CHUNK_GOT = -1;
	CURRENT_FRAME = -1;
	DATA_PREFIX = dataUrlPrefix;
	
	TIME_STARTED_FETCH = 0;
	
	var dataFetcher = this;
	var startedDrawing = false;
	
	STATIC_CHUNK_LISTENER = function(json) {
		$.each(json.Frames, function() {
			FRAMES.push(this);
		});
		
		console.log("got a chunk in "+(Date.now() - TIME_STARTED_FETCH) + "ms");
		
		LATEST_CHUNK_GOT = parseInt(json.ChunkNumber);
		if (!startedDrawing) {
			startedDrawing = true;
			startFrames();
			
		}
		
		if(parseInt(LATEST_CHUNK_GOT) < parseInt(json.TotalChunks)) {
			getChunk(LATEST_CHUNK_GOT + 1);
		}
	}
	
	function CHUNKPATH_(n) {
		return DATA_PREFIX + n + '.json';
	};
	
	function drawNextFrame() {
		
		if(++CURRENT_FRAME >= FRAMES.length) {
			CURRENT_FRAME = 0;
			console.log("looped");
		}
		// todo: check if we're really all out of frames coming in.
		if (dataFetcher.drawFunction) {
			dataFetcher.drawFunction(FRAMES[CURRENT_FRAME]);
		}
	
	}
	
	
	
	
	function getChunk(n) {
		$.ajax({
		    url: CHUNKPATH_(n),
		    dataType: 'jsonp',
		    cache: true,
		    //jsonpCallback: ChunkReceived
		});
		TIME_STARTED_FETCH = Date.now();
	}
	
	
	function getNextChunk() {
		getChunk(LATEST_CHUNK_GOT + 1);
	}
	
	
	
	
	// not yet implemented - a function to discard (or empty) old frames that have already been displayed.
	// If we're ever dealing with too much data to comfortably hold in memory (as opposed to just too much to download at once), we'll need this
	function discardOldFrames() {
	}
	
	
	// poll()
	//setInterval(poll, 10);
	
	
	// start downloading the chunks immediately...
	getNextChunk();
	
	function startFrames() {
		setInterval(drawNextFrame, FRAMERATE);
	}

}

