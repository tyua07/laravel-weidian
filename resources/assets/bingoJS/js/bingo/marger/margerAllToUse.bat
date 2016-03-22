
call marger.bat
call marger.mv.bat

cd build

copy /b /y bingo.core.js + bingo.mv.js + bingo.mv.factory.js + bingo.mv.command.js + bingo.mv.filter.js bingo.js

copy /b /y bingo.core-vsdoc.js + bingo.mv-vsdoc.js + bingo.mv.factory-vsdoc.js bingo-vsdoc.js

cd ..

cd build

xcopy bingo.js ..\..\..\..\help1.1\scripts  /Y
xcopy bingo-vsdoc.js ..\..\..\..\help1.1\scripts /Y

xcopy bingo.js ..\..\..\..\demo\scripts  /Y
xcopy bingo-vsdoc.js ..\..\..\..\demo\scripts /Y

xcopy bingo.js ..\..\..\..\demo\bootstrap\bingojs  /Y
xcopy bingo-vsdoc.js ..\..\..\..\demo\bootstrap\bingojs /Y

xcopy bingo.js ..\..\..\..\jasmine\src /Y

d:\Projects\Iaas\PS\bingoJS\demo\bootstrap\

del /q *.*

cd ..

pause