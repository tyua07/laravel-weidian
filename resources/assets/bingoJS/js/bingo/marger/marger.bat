
cd ..

copy /b /y console.js + core.js + datavalue.js + Event.js + variable.js + Class.js + linq.js + equals.js + fetch.js + package.js + route.js + cache.js bingo.core.js

copy /b /y console-vsdoc.js + core-vsdoc.js + datavalue-vsdoc.js + Event-vsdoc.js + variable-vsdoc.js + Class-vsdoc.js  + linq-vsdoc.js + equals-vsdoc.js + fetch-vsdoc.js + package-vsdoc.js + route-vsdoc.js + cache-vsdoc.js bingo.core-vsdoc.js

move bingo.core.js marger/build/bingo.core.js

move bingo.core-vsdoc.js marger/build/bingo.core-vsdoc.js

cd marger
