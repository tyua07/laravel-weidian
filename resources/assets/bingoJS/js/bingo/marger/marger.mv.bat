cd ../mv

copy /b /y linkToDom.js + module.js + factory.js + model.js + observer.js + ajax.js + compiles.js + view.js + filter.js + render.js bingo.mv.js

copy /b /y linkToDom-vsdoc.js + module-vsdoc.js + factory-vsdoc.js + model-vsdoc.js + observer-vsdoc.js + ajax-vsdoc.js + compiles-vsdoc.js + view-vsdoc.js + filter-vsdoc.js + render-vsdoc.js bingo.mv-vsdoc.js

move bingo.mv.js ../marger/build/bingo.mv.js
move bingo.mv-vsdoc.js ../marger/build/bingo.mv-vsdoc.js

cd factory

copy /b /y base.js + linq.js + location.js + render.js + timeout.js bingo.mv.factory.js

copy /b /y base.js + linq.js + location.js + render.js + timeout.js bingo.mv.factory-vsdoc.js

move bingo.mv.factory.js ../../marger/build/bingo.mv.factory.js
move bingo.mv.factory-vsdoc.js ../../marger/build/bingo.mv.factory-vsdoc.js

cd ..

cd command

copy /b /y action.js + attrs.js + event.js + for.js + route.js + html.js + if.js + include.js + model.js + styles.js + text.js + include.js + node.js + base.js bingo.mv.command.js

move bingo.mv.command.js ../../marger/build/bingo.mv.command.js

cd ..

cd filter

copy /b /y base.js  bingo.mv.filter.js

move bingo.mv.filter.js ../../marger/build/bingo.mv.filter.js

cd ..

cd ../marger

