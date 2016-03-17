(function () {
	'use strict';

    var app = {};

    app.Model = Backbone.Model.extend({
        defaults: {
            id: ''
        }
    });

    app.Collection = Backbone.Collection.extend({
        model: app.Model,
        url: 'events',
        localStorage: new Backbone.LocalStorage('events')
    });

    app.EventView = Backbone.NativeView.extend({
        buttons: function () {
            var self = this;

            document.querySelector('.close').addEventListener('click', function (event) {
                event.preventDefault();
                    self.close();
            });

            document.querySelector('.apply').addEventListener('click', function (event) {
                event.preventDefault();
                    self.apply();
            });

            document.querySelector('.delete').addEventListener('click', function (event) {
                event.preventDefault();
                    self.destroy();
            });

        },
        template: _.template(
            document.querySelector('#calendar-popup-tmpl').innerHTML.trim()
        ),
        initialize: function () {
            this.close();
        },
        render: function (event) {
            this.target = event.target;

            var id = event.target.dataset.id.replace('id-', ''),
                currentModel = _.filter(this.collection.toJSON(), function (model) {
                if (model.id === id) {
                    return {
                        id: model.id,
                        event: model.event,
                        names: model.names,
                        comment: model.comment
                    };
                }
            })[0];

            var params = currentModel ? currentModel : {
                id: id,
                event: '',
                names: '',
                comment: ''
            };

            this.open(event, params);
        },
        open: function (event, params) {
            var div = document.createElement('div'),
                fragment = document.createDocumentFragment(),
                left = event.clientX,
                top = event.clientY;

            div.className = 'calendar-popup';
            div.innerHTML = this.template({ params: params });
            div.setAttribute('style', 'left: ' + left + 'px; top: ' + top + 'px;');
            fragment.appendChild(div);
            document.body.insertBefore(fragment, null);

            this.buttons();
        },
        apply: function () {
            var id = document.querySelector('[name="date"]').value;

            this.model.set({
                id: id,
                event: document.querySelector('[name="event"]').value,
                names: document.querySelector('[name="names"]').value,
                comment: document.querySelector('[name="comment"]').value
            });

            if (document.querySelector('[name="event"]').value) {
                this.collection.create(this.model);

                document.querySelector('h4[data-id="id-' + id + '"]').innerText = document.querySelector('[name="event"]').value || '';
                document.querySelector('small[data-id="id-' + id + '"]').innerText = document.querySelector('[name="names"]').value || '';
                document.querySelector('p[data-id="id-' + id + '"]').innerText = document.querySelector('[name="comment"]').value || '';

                this.close();
            }
            else {
                document.querySelector('[name="event"]').style.borderColor = 'red';
            }
        },
        close: function () {
            var popup = document.querySelector('.calendar-popup');

            if (popup) {
                popup.remove();
            }
        },
        destroy: function () {
            var id = this.target.dataset.id.replace('id-', ''),
                model = this.collection.get(id);

            model.destroy();

            document.querySelector('h4[data-id="id-' + id + '"]').innerText = '';
            document.querySelector('small[data-id="id-' + id + '"]').innerText = '';
            document.querySelector('p[data-id="id-' + id + '"]').innerText = '';

            this.target.classList.remove('selected');
            this.target.parentNode.classList.remove('selected');
            this.close();
        }
    });



    app.Calendar = Backbone.NativeView.extend({
        today: new Date(),
        locale: {
            months: [
                'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
            ],

            days: [
                'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'
            ]
        },
        el: '#app',
        template: _.template(
            document.querySelector('#calendar-table-tmpl').innerHTML.trim()
        ),
        initialize: function () {
            this.collection = new app.Collection();
            this.collection.fetch();
            this.render(this.today.getDate(), parseInt(this.today.getMonth()) + 1, this.today.getFullYear());
        },
        events: {
            'click .next'           : 'nextMonth',
            'click .prev'           : 'prevMonth',
            'click .current'        : 'currentMonth',
            'click .item-handler'   : 'selectDate'
        },
        render: function (day, month, year){
            var div = document.createElement('div'),
                fragment = document.createDocumentFragment();

            // total days in month
            var totalDays = 32 - new Date(year, month - 1, 32).getDate(),

            // get start day
                startDay = new Date(year, month - 1, 1).getDay();

            if (startDay === 0) {
                startDay = 7;
            }

            startDay--;

            // final num
            var finalIndex = Math.ceil((totalDays + startDay) / 7) * 7;

            var events = _.reduce(this.collection.toJSON(), function(object, item) {
                var obj = {};
                obj[item.id] = item;

                _.extend(object, obj);

                return object;
            }, {}) || {};

            // show calendar
            div.innerHTML = this.template({
                'calendar': this,
                'total': totalDays,
                'start': startDay,
                'final': finalIndex,
                'day': day,
                'month': month,
                'year': year,
                'events': events
            });

            fragment.appendChild(div);
            this.el.innerHTML = '';
            this.el.insertBefore(fragment, null);
        },
        nextMonth: function (event) {
            event.preventDefault();

            var month = Number(event.target.dataset.month),
                year = Number(event.target.dataset.year);

            this.render(null, (month < 12 ? (month + 1) : 1), (month < 12 ? year : (year + 1)));
        },
        prevMonth: function (event) {
            event.preventDefault();

            var month = Number(event.target.dataset.month),
                year = Number(event.target.dataset.year);

            this.render(null, (month > 1 ? (month - 1) : 12), (month > 1 ? year : (year - 1)));
        },
        currentMonth: function (event) {
            event.preventDefault();

            this.render(this.today.getDate(), parseInt(this.today.getMonth()) + 1, this.today.getFullYear());
        },
        selectDate: function (event) {
            event.stopPropagation();

            this.eventView = new app.EventView({ el: event.target });
            this.eventView.collection = this.collection;
            this.eventView.model = new app.Model({ id: event.target.dataset.id });
            this.eventView.render(event);

            event.target.classList.add('selected');
        }
    });


    new app.Calendar();
}());