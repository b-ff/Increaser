// Biryukov Vyacheslav (NetWorm)
// Increaser jQuery plugin
// 12.07.2012

(function($){

    jQuery.fn.increaser = function(speed){

        // Если скорость изменения значения не задана - устанавливаем дефолтные 600
    	if (typeof speed == "undefined") { speed = 600; }

        // Объект состояния плагина
        Increaser = {
        	speed: speed, // время за которое необходимо "пересчитать" число
        	step: 0,   // Текущий шаг
        	interval: 0,   // Указатель интервала пересчитывающего числа
        	elements: []   // DOM-объекты в которых необходимо пересчитать числа
        }

        // Обрабатываем каждый элемент
        this.each(function() {

	        var isSpaced = jQuery(this).text().match(' ') != null; // (bool) разделено ли число пробелами
	        var value = (isSpaced) ? jQuery(this).text().replace(' ', '') : jQuery(this).text(); // (int) Число без разделителей разрядов

            // Сохраняем параметры текущего элемента в виде объекта в массиве элементов с которыми будем работать
	        Increaser.elements[Increaser.elements.length] = {
	        	node: this,   // Ссылка на сам элемент
	        	spaced: isSpaced, // (bool) разделено ли число пробелами
	        	value: 0, // Начальное значение (пересчитываем числа от 0)
	        	maxValue: parseInt(value),    // Конечное значение (до которого мы будем считать)
	        	step: parseInt(value) / speed // Шаг на который следует увеличивать пересчитываемое число в каждой итерации
	        }

            // Пишем в элемент "0"
	        jQuery(this).text(0);

        });

        // Интервал пересчитывающий наши элементы
        Increaser.interval = setInterval(function() {

            // Если время вышло, то останавливаем наши итерации
        	if (Increaser.step >= Increaser.speed) { clearInterval(Increaser.interval); }

            // Для каждого элемента который необходимо пересчитать
        	for (var i = 0; i < Increaser.elements.length; i++) {
        		
                // Получаем текущее значение для этой итерации
        		var currentValue = Increaser.elements[i].value + Increaser.elements[i].step;

                // Обновляем его в объекте свойств элемента
        		Increaser.elements[i].value = currentValue;
        		
                // Если вдруг текущее значение превысило конечное
        		if (currentValue > Increaser.elements[i].maxValue) {
                    // То откатываем его до конечного
        			currentValue = Increaser.elements[i].maxValue
        		}

                // Округляем на случай если у нас получится дробь
                // TODO: сделать проверку, на случай если число было изначально дробным
        		currentValue = Math.round(currentValue);

                // Если разряды числа были разделены пробелами возвращаем их
        		if (Increaser.elements[i].spaced) {
        			currentValue = currentValue.toString().replace(/.+?(?=\D|$)/, function(f) {
					    return f.replace(/(\d)(?=(?:\d\d\d)+$)/g, "$1 ");
					});

        		}

                // Пишем результат в элемент на странице
        		jQuery(Increaser.elements[i].node).text(currentValue);


        	};

            // Увеличиваем счётчик числа итераций
    		Increaser.step++;

        }, 1);

    }   

})(jQuery);