
call marger.bat
call marger.mv.bat

cd build

copy /b /y bingo.core.js + bingo.mv.js + bingo.mv.factory.js + bingo.mv.command.js + bingo.mv.filter.js bingo.js

copy /b /y bingo.core-vsdoc.js + bingo.mv-vsdoc.js + bingo.mv.factory-vsdoc.js bingo-vsdoc.js


del /q bingo.core.js bingo.mv.js bingo.mv.factory.js bingo.mv.command.js bingo.mv.filter.js
del /q bingo.core-vsdoc.js bingo.mv-vsdoc.js bingo.mv.factory-vsdoc.js

cd ..

pause