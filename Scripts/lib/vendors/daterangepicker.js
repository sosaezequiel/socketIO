(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Make globaly available as well
        define(['moment', 'jquery'], function (moment, jquery) {
            if (!jquery.fn) jquery.fn = {}; // webpack server rendering
            if (typeof moment !== 'function' && moment.default) moment = moment.default
            return factory(moment, jquery);
        });
    } else if (typeof module === 'object' && module.exports) {
        // Node / Browserify
        //isomorphic issue
        var jQuery = (typeof window != 'undefined') ? window.jQuery : undefined;
        if (!jQuery) {
            jQuery = require('jquery');
            if (!jQuery.fn) jQuery.fn = {};
        }
        var moment = (typeof window != 'undefined' && typeof window.moment != 'undefined') ? window.moment : require('moment');
        module.exports = factory(moment, jQuery);
    } else {
        // Browser globals
        root.daterangepicker = factory(root.moment, root.jQuery);
    }
})(this, function(moment, $) {
    var DateRangePicker = function(element, options, cb) {
        this.parentEl = "body";
        this.element = $(element);
        this.startDate = moment().startOf("day");
        this.endDate = moment().endOf("day");
        this.minDate = false;
        this.maxDate = false;
        this.dateLimit = false;
        this.autoApply = false;
        this.singleDatePicker = false;
        this.showWeekNumbers = false;
        this.showISOWeekNumbers = false;
        this.showCustomRangeLabel = true;
        this.lastCustomRange = {
            startDate: null,
            endDate: null
        };
        this.linkedCalendars = true;
        this.autoUpdateInput = true;
        this.alwaysShowCalendars = false;
        this.ranges = {};
        this.isStartActive = true;
        this.applyOnChange = false;
        this.opens = "right";
        if (this.element.hasClass("pull-right"))
            this.opens = "left";
        this.drops = "down";
        if (this.element.hasClass("dropup"))
            this.drops = "up";
        this.buttonClasses = "btn btn-sm";
        this.applyClass = "btn-success";
        this.locale = {
            direction: "ltr",
            format: "DD/MM/YY",
            maskFormat: "00/00/00",
            datePlaceholder: "DD/MM/YY",
            separator: " - ",
            applyLabel: "Apply",
            startLabel: "From:",
            endLabel: "End:",
            weekLabel: "W",
            customRangeDescriptionLabel: "Select date range",
            customRangeLabel: "Custom",
            daysOfWeek: moment.weekdaysMin(),
            oneLetterDayName: false,
            monthNames: moment.monthsShort(),
            firstDay: moment.localeData().firstDayOfWeek()
        };
        this.callback = function() {}
        ;
        this.isShowing = false;
        this.leftCalendar = {};
        this.rightCalendar = {};
        if (typeof options !== "object" || options === null)
            options = {};
        options = $.extend(this.element.data(), options);
        if (typeof options.template !== "string" && !(options.template instanceof $))
            options.template = '<div class="daterangepicker  xs-tooltip  ">' + '<div class="calendar left">' + '<div class="daterangepicker_input">' + '<span class="from-date-label">' + options.locale.startLabel + "</span>" + '<input class="input-mini form-control" type="text" name="daterangepicker_start" value="" />' + "</div>" + '<div class="calendar-table"></div>' + "</div>" + '<div class="calendar right">' + '<div class="daterangepicker_input">' + '<span class="to-date-label">' + options.locale.endLabel + "</span>" + '<input class="input-mini form-control" type="text" name="daterangepicker_end" value="" />' + "</div>" + '<div class="calendar-table"></div>' + "</div>" + '<div class="ranges">' + '<div class="ranges-dropdown-label">' + options.locale.customRangeDescriptionLabel + "</div>" + '<div class="ranges-dropdown dropdown">' + '<button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenuRanges" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">' + '<span class="dropdown-button">Period</span><span class="caret"></span>' + "</button>" + '<ul class="dropdown-menu" aria-labelledby="dropdownMenuRanges"></ul>' + "</div>" + "</div>" + '<div class="range_inputs">' + '<button class="applyBtn" disabled="disabled" type="button"></button> ' + "</div>" + "</div>" + "</div>";
        this.parentEl = options.parentEl && $(options.parentEl).length ? $(options.parentEl) : $(this.parentEl);
        this.container = $(options.template).appendTo(this.parentEl);
        if (typeof options.locale === "object") {
            if (typeof options.locale.direction === "string")
                this.locale.direction = options.locale.direction;
            if (typeof options.locale.format === "string")
                this.locale.format = options.locale.format;
            if (typeof options.locale.maskFormat === "string")
                this.locale.maskFormat = options.locale.maskFormat;
            if (typeof options.locale.datePlaceholder === "string")
                this.locale.datePlaceholder = options.locale.datePlaceholder;
            if (typeof options.locale.separator === "string")
                this.locale.separator = options.locale.separator;
            if (typeof options.locale.daysOfWeek === "object")
                this.locale.daysOfWeek = options.locale.daysOfWeek.slice();
            if (typeof options.locale.oneLetterDayName === "boolean")
                this.locale.oneLetterDayName = options.locale.oneLetterDayName;
            if (typeof options.locale.startLabel === "string")
                this.locale.startLabel = options.locale.startLabel;
            if (typeof options.locale.endLabel === "string")
                this.locale.endLabel = options.locale.endLabel;
            if (typeof options.locale.customRangeDescriptionLabel === "string")
                this.locale.customRangeDescriptionLabel = options.locale.customRangeDescriptionLabel;
            if (typeof options.locale.monthNames === "object")
                this.locale.monthNames = options.locale.monthNames.slice();
            if (typeof options.locale.firstDay === "number")
                this.locale.firstDay = options.locale.firstDay;
            if (typeof options.locale.applyLabel === "string")
                this.locale.applyLabel = options.locale.applyLabel;
            if (typeof options.locale.weekLabel === "string")
                this.locale.weekLabel = options.locale.weekLabel;
            if (typeof options.locale.customRangeLabel === "string") {
                var elem = document.createElement("textarea");
                elem.innerHTML = options.locale.customRangeLabel;
                var rangeHtml = elem.value;
                this.locale.customRangeLabel = rangeHtml
            }
        }
        this.container.addClass(this.locale.direction);
        if (typeof options.startDate === "string")
            this.startDate = moment(options.startDate, this.locale.format);
        if (typeof options.endDate === "string")
            this.endDate = moment(options.endDate, this.locale.format);
        if (typeof options.minDate === "string")
            this.minDate = moment(options.minDate, this.locale.format);
        if (typeof options.maxDate === "string")
            this.maxDate = moment(options.maxDate, this.locale.format);
        if (typeof options.startDate === "object")
            this.startDate = moment(options.startDate);
        if (typeof options.endDate === "object")
            this.endDate = moment(options.endDate);
        if (typeof options.minDate === "object")
            this.minDate = moment(options.minDate);
        if (typeof options.maxDate === "object")
            this.maxDate = moment(options.maxDate);
        if (this.minDate && this.startDate.isBefore(this.minDate))
            this.startDate = this.minDate.clone();
        if (this.maxDate && this.endDate.isAfter(this.maxDate))
            this.endDate = this.maxDate.clone();
        if (typeof options.applyClass === "string")
            this.applyClass = options.applyClass;
        if (typeof options.dateLimit === "object")
            this.dateLimit = options.dateLimit;
        if (typeof options.opens === "string")
            this.opens = options.opens;
        if (typeof options.drops === "string")
            this.drops = options.drops;
        if (typeof options.showWeekNumbers === "boolean")
            this.showWeekNumbers = options.showWeekNumbers;
        if (typeof options.showISOWeekNumbers === "boolean")
            this.showISOWeekNumbers = options.showISOWeekNumbers;
        if (typeof options.buttonClasses === "string")
            this.buttonClasses = options.buttonClasses;
        if (typeof options.buttonClasses === "object")
            this.buttonClasses = options.buttonClasses.join(" ");
        if (typeof options.showCustomRangeLabel === "boolean")
            this.showCustomRangeLabel = options.showCustomRangeLabel;
        if (typeof options.singleDatePicker === "boolean") {
            this.singleDatePicker = options.singleDatePicker;
            if (this.singleDatePicker)
                this.endDate = this.startDate.clone()
        }
        if (typeof options.autoApply === "boolean")
            this.autoApply = options.autoApply;
        if (typeof options.autoUpdateInput === "boolean")
            this.autoUpdateInput = options.autoUpdateInput;
        if (typeof options.linkedCalendars === "boolean")
            this.linkedCalendars = options.linkedCalendars;
        if (typeof options.isInvalidDate === "function")
            this.isInvalidDate = options.isInvalidDate;
        if (typeof options.isCustomDate === "function")
            this.isCustomDate = options.isCustomDate;
        if (typeof options.alwaysShowCalendars === "boolean")
            this.alwaysShowCalendars = options.alwaysShowCalendars;
        if (this.locale.firstDay != 0) {
            var iterator = this.locale.firstDay;
            while (iterator > 0) {
                this.locale.daysOfWeek.push(this.locale.daysOfWeek.shift());
                iterator--
            }
        }
        var start, end, range;
        if (typeof options.startDate === "undefined" && typeof options.endDate === "undefined") {
            if ($(this.element).is("input[type=text]")) {
                var val = $(this.element).val()
                  , split = val.split(this.locale.separator);
                start = end = null;
                if (split.length == 2) {
                    start = moment(split[0], this.locale.format);
                    end = moment(split[1], this.locale.format)
                } else if (this.singleDatePicker && val !== "") {
                    start = moment(val, this.locale.format);
                    end = moment(val, this.locale.format)
                }
                if (start !== null && end !== null) {
                    this.setStartDate(start);
                    this.setEndDate(end)
                }
            }
        }
        if (typeof options.ranges === "object") {
            for (range in options.ranges) {
                if (typeof options.ranges[range][0] === "string")
                    start = moment(options.ranges[range][0], this.locale.format);
                else
                    start = moment(options.ranges[range][0]);
                if (typeof options.ranges[range][1] === "string")
                    end = moment(options.ranges[range][1], this.locale.format);
                else
                    end = moment(options.ranges[range][1]);
                if (this.minDate && start.isBefore(this.minDate))
                    start = this.minDate.clone();
                var maxDate = this.maxDate;
                if (this.dateLimit && maxDate && start.clone().add(this.dateLimit).isAfter(maxDate))
                    maxDate = start.clone().add(this.dateLimit);
                if (maxDate && end.isAfter(maxDate))
                    end = maxDate.clone();
                if (this.minDate && end.isBefore(this.minDate, "day") || maxDate && start.isAfter(maxDate, "day"))
                    continue;
                var elem = document.createElement("textarea");
                elem.innerHTML = range;
                var rangeHtml = elem.value;
                this.ranges[rangeHtml] = [start, end]
            }
            var list = "";
            for (range in this.ranges) {
                list += '<li data-range-key="' + range + '">' + range + "</li>"
            }
            if (this.showCustomRangeLabel) {
                list += '<li data-range-key="' + this.locale.customRangeLabel + '">' + this.locale.customRangeLabel + "</li>"
            }
            this.container.find(".ranges .dropdown-menu").append(list);
            try {
                this.element.find(".input-mini").mask(this.locale.maskFormat, {
                    placeholder: this.locale.datePlaceholder
                })
            } catch (e) {}
        }
        if (typeof cb === "function") {
            this.callback = cb
        }
        this.startDate = this.startDate.startOf("day");
        this.endDate = this.endDate.endOf("day");
        if (this.autoApply && typeof options.ranges !== "object") {
            this.container.find(".ranges-dropdown").hide()
        } else if (this.autoApply) {
            this.container.find(".applyBtn").addClass("hide")
        }
        if (this.singleDatePicker) {
            this.container.addClass("single");
            this.container.find(".calendar.left").addClass("single");
            this.container.find(".calendar.left").show();
            this.container.find(".calendar.right").hide();
            this.container.find(".daterangepicker_input input, .daterangepicker_input > i").hide();
            this.container.find(".ranges-dropdown").hide()
        }
        if (typeof options.ranges === "undefined" && !this.singleDatePicker || this.alwaysShowCalendars) {
            this.container.addClass("show-calendar")
        }
        this.container.addClass("opens" + this.opens);
        this.container.find(".applyBtn").addClass(this.buttonClasses);
        if (this.applyClass.length)
            this.container.find(".applyBtn").addClass(this.applyClass);
        this.container.find(".applyBtn").html(this.locale.applyLabel);
        this.container.find(".calendar").on("click.daterangepicker", ".prev", $.proxy(this.clickPrev, this)).on("click.daterangepicker", ".next", $.proxy(this.clickNext, this)).on("mousedown.daterangepicker", "td.available", $.proxy(this.clickDate, this)).on("change.daterangepicker", "select.yearselect", $.proxy(this.monthOrYearChanged, this)).on("change.daterangepicker", "select.monthselect", $.proxy(this.monthOrYearChanged, this)).on("click.daterangepicker", ".daterangepicker_input input", $.proxy(this.showCalendars, this)).on("focus.daterangepicker", ".daterangepicker_input input", $.proxy(this.formInputsFocused, this)).on("blur.daterangepicker", ".daterangepicker_input input", $.proxy(this.formInputsBlurred, this)).on("change.daterangepicker", ".daterangepicker_input input", $.proxy(this.formInputsChanged, this)).on("keypress.daterangepicker", ".daterangepicker_input input", $.proxy(this.formInputsKeyPress, this));
        this.container.find(".range_inputs").on("click.daterangepicker", "button.applyBtn", $.proxy(this.clickApply, this));
        this.container.find(".ranges-dropdown ul").on("click.daterangepicker", "li", $.proxy(this.clickRange, this)).on("mouseenter.daterangepicker", "li", $.proxy(this.hoverRange, this)).on("mouseleave.daterangepicker", "li", $.proxy(this.updateFormInputs, this));
        if (this.element.is("input") || this.element.is("button")) {
            this.element.on({
                "click.daterangepicker": $.proxy(this.show, this),
                "focus.daterangepicker": $.proxy(this.show, this),
                "keyup.daterangepicker": $.proxy(this.elementChanged, this),
                "keydown.daterangepicker": $.proxy(this.keydown, this)
            })
        } else {
            this.element.on("click.daterangepicker", $.proxy(this.toggle, this))
        }
        if (this.element.is("input") && !this.singleDatePicker && this.autoUpdateInput) {
            this.element.val(this.startDate.format(this.locale.format) + this.locale.separator + this.endDate.format(this.locale.format));
            this.element.trigger("change")
        } else if (this.element.is("input") && this.autoUpdateInput) {
            this.element.val(this.startDate.format(this.locale.format));
            this.element.trigger("change")
        }
        this.setStartActive(true)
    };
    DateRangePicker.prototype = {
        constructor: DateRangePicker,
        setStartActive: function(value) {
            this.isStartActive = value;
            if (this.isStartActive) {
                this.container.find('input[name="daterangepicker_end"]').removeClass("active");
                this.container.find('input[name="daterangepicker_start"]').addClass("active");
                this.container.find(".calendar").removeClass("select-end")
            } else {
                this.container.find('input[name="daterangepicker_end"]').addClass("active");
                this.container.find('input[name="daterangepicker_start"]').removeClass("active");
                this.container.find(".calendar").addClass("select-end")
            }
        },
        setStartDate: function(startDate) {
            if (typeof startDate === "string")
                this.startDate = moment(startDate, this.locale.format);
            if (typeof startDate === "object")
                this.startDate = moment(startDate);
            this.startDate = this.startDate.startOf("day");
            if (this.minDate && this.startDate.isBefore(this.minDate)) {
                this.startDate = this.minDate.clone()
            }
            if (this.maxDate && this.startDate.isAfter(this.maxDate)) {
                this.startDate = this.maxDate.clone()
            }
            if (!this.isShowing)
                this.updateElement();
            this.updateMonthsInView()
        },
        setEndDate: function(endDate) {
            if (typeof endDate === "string")
                this.endDate = moment(endDate, this.locale.format);
            if (typeof endDate === "object")
                this.endDate = moment(endDate);
            this.endDate = this.endDate.endOf("day");
            if (this.endDate.isBefore(this.startDate))
                this.endDate = this.startDate.clone();
            if (this.maxDate && this.endDate.isAfter(this.maxDate))
                this.endDate = this.maxDate.clone();
            if (this.dateLimit && this.startDate.clone().add(this.dateLimit).isBefore(this.endDate))
                this.endDate = this.startDate.clone().add(this.dateLimit);
            this.previousRightTime = this.endDate.clone();
            if (!this.isShowing)
                this.updateElement();
            this.updateMonthsInView()
        },
        setMaxDate: function(maxDate) {
            if (typeof maxDate === "string")
                this.maxDate = moment(maxDate, this.locale.format);
            if (typeof maxDate === "object")
                this.maxDate = moment(maxDate);
            this.maxDate = this.maxDate.endOf("day");
            if (this.endDate.isAfter(this.maxDate))
                this.endDate = this.maxDate.clone();
            if (this.startDate.isAfter(this.maxDate))
                this.startDate = this.maxDate.clone();
            if (!this.isShowing)
                this.updateElement();
            this.updateMonthsInView()
        },
        isInvalidDate: function() {
            return false
        },
        isCustomDate: function() {
            return false
        },
        updateSelectedPeriod: function() {
            var button = this.container.find(".dropdown-button");
            button.html(this.chosenLabel)
        },
        updateView: function() {
            this.updateMonthsInView();
            this.updateCalendars();
            this.updateFormInputs();
            this.updateSelectedPeriod()
        },
        updateMonthsInView: function() {
            if (this.isStartActive) {
                this.leftCalendar.month = this.startDate.clone().date(2);
                this.rightCalendar.month = this.startDate.clone().date(2)
            } else {
                this.leftCalendar.month = this.endDate.clone().date(2);
                this.rightCalendar.month = this.endDate.clone().date(2)
            }
        },
        updateCalendars: function() {
            this.renderCalendar("left");
            this.renderCalendar("right");
            this.container.find(".ranges-dropdown li").removeClass("active");
            if (this.endDate == null)
                return;
            this.calculateChosenLabel()
        },
        renderCalendar: function(side) {
            var calendar = side == "left" ? this.leftCalendar : this.rightCalendar;
            var month = calendar.month.month();
            var year = calendar.month.year();
            var hour = calendar.month.hour();
            var minute = calendar.month.minute();
            var second = calendar.month.second();
            var daysInMonth = moment([year, month]).daysInMonth();
            var firstDay = moment([year, month, 1]);
            var lastDay = moment([year, month, daysInMonth]);
            var lastMonth = moment(firstDay).subtract(1, "month").month();
            var lastYear = moment(firstDay).subtract(1, "month").year();
            var daysInLastMonth = moment([lastYear, lastMonth]).daysInMonth();
            var dayOfWeek = firstDay.day();
            var calendar = [];
            calendar.firstDay = firstDay;
            calendar.lastDay = lastDay;
            for (var i = 0; i < 6; i++) {
                calendar[i] = []
            }
            var startDay = daysInLastMonth - dayOfWeek + this.locale.firstDay + 1;
            if (startDay > daysInLastMonth)
                startDay -= 7;
            if (dayOfWeek == this.locale.firstDay)
                startDay = daysInLastMonth - 6;
            var curDate = moment([lastYear, lastMonth, startDay, 12, minute, second]);
            var col, row;
            for (var i = 0, col = 0, row = 0; i < 42; i++,
            col++,
            curDate = moment(curDate).add(24, "hour")) {
                if (i > 0 && col % 7 === 0) {
                    col = 0;
                    row++
                }
                calendar[row][col] = curDate.clone().hour(hour).minute(minute).second(second);
                curDate.hour(12);
                if (this.minDate && calendar[row][col].format("DD-MM-YYYY") == this.minDate.format("DD-MM-YYYY") && calendar[row][col].isBefore(this.minDate) && side == "left") {
                    calendar[row][col] = this.minDate.clone()
                }
                if (this.maxDate && calendar[row][col].format("DD-MM-YYYY") == this.maxDate.format("DD-MM-YYYY") && calendar[row][col].isAfter(this.maxDate) && side == "right") {
                    calendar[row][col] = this.maxDate.clone()
                }
            }
            if (side == "left") {
                this.leftCalendar.calendar = calendar
            } else {
                this.rightCalendar.calendar = calendar
            }
            var minDate = side == "left" ? this.minDate : this.startDate;
            var maxDate = this.maxDate;
            var selected = side == "left" ? this.startDate : this.endDate;
            var arrow = this.locale.direction == "ltr" ? {
                left: "chevron-left",
                right: "chevron-right"
            } : {
                left: "chevron-right",
                right: "chevron-left"
            };
            var html = '<table class="table-condensed">';
            html += "<thead>";
            html += "<tr>";
            if (this.showWeekNumbers || this.showISOWeekNumbers)
                html += "<th></th>";
            if ((!minDate || minDate.isBefore(calendar.firstDay)) && (!this.linkedCalendars || side == "left")) {
                html += '<th class="prev available"><i class="fa fa-' + arrow.left + " glyphicon glyphicon-" + arrow.left + '"></i></th>'
            } else {
                html += "<th></th>"
            }
            var dateHtml = this.locale.monthNames[calendar[1][1].month()] + calendar[1][1].format(" YYYY");
            html += '<th colspan="5" class="month">' + dateHtml + "</th>";
            if ((!maxDate || maxDate.isAfter(calendar.lastDay)) && (!this.linkedCalendars || side == "right" || this.singleDatePicker)) {
                html += '<th class="next available"><i class="fa fa-' + arrow.right + " glyphicon glyphicon-" + arrow.right + '"></i></th>'
            } else {
                html += "<th></th>"
            }
            html += "</tr>";
            html += '<tr  class="day-names">';
            if (this.showWeekNumbers || this.showISOWeekNumbers)
                html += '<th class="week">' + this.locale.weekLabel + "</th>";
            var oneLetterDayName = this.locale.oneLetterDayName;
            $.each(this.locale.daysOfWeek, function(index, dayOfWeek) {
                if (!oneLetterDayName) {
                    html += "<th>" + dayOfWeek + "</th>"
                } else {
                    html += "<th>" + dayOfWeek.substring(0, 1) + "</th>"
                }
            });
            html += "</tr>";
            html += "</thead>";
            html += "<tbody>";
            if (this.endDate == null && this.dateLimit) {
                var maxLimit = this.startDate.clone().add(this.dateLimit).endOf("day");
                if (!maxDate || maxLimit.isBefore(maxDate)) {
                    maxDate = maxLimit
                }
            }
            for (var row = 0; row < 6; row++) {
                html += "<tr>";
                if (this.showWeekNumbers)
                    html += '<td class="week">' + calendar[row][0].week() + "</td>";
                else if (this.showISOWeekNumbers)
                    html += '<td class="week">' + calendar[row][0].isoWeek() + "</td>";
                for (var col = 0; col < 7; col++) {
                    var classes = [];
                    if (calendar[row][col].isSame(new Date, "day"))
                        classes.push("today");
                    if (calendar[row][col].isoWeekday() > 5)
                        classes.push("weekend");
                    if (calendar[row][col].month() != calendar[1][1].month())
                        classes.push("off");
                    if (this.minDate && calendar[row][col].isBefore(this.minDate, "day"))
                        classes.push("off", "disabled");
                    if (maxDate && calendar[row][col].isAfter(maxDate, "day"))
                        classes.push("off", "disabled");
                    if (this.isInvalidDate(calendar[row][col]))
                        classes.push("off", "disabled");
                    if (calendar[row][col].format("DD-MM-YYYY") == this.startDate.format("DD-MM-YYYY"))
                        classes.push("active", "start-date");
                    if (this.endDate != null && calendar[row][col].format("DD-MM-YYYY") == this.endDate.format("DD-MM-YYYY"))
                        classes.push("active", "end-date");
                    if (this.endDate != null && calendar[row][col] > this.startDate && calendar[row][col] < this.endDate)
                        classes.push("in-range");
                    var isCustom = this.isCustomDate(calendar[row][col]);
                    if (isCustom !== false) {
                        if (typeof isCustom === "string")
                            classes.push(isCustom);
                        else
                            Array.prototype.push.apply(classes, isCustom)
                    }
                    var cname = ""
                      , disabled = false;
                    for (var i = 0; i < classes.length; i++) {
                        cname += classes[i] + " ";
                        if (classes[i] == "disabled")
                            disabled = true
                    }
                    if (!disabled)
                        cname += "available";
                    html += '<td class="' + cname.replace(/^\s+|\s+$/g, "") + '" data-title="' + "r" + row + "c" + col + '">' + calendar[row][col].date() + "</td>"
                }
                html += "</tr>"
            }
            html += "</tbody>";
            html += "</table>";
            this.container.find(".calendar." + side + " .calendar-table").html(html)
        },
        updateFormInputs: function() {
            this.container.find("input[name=daterangepicker_start]").val(this.startDate.format(this.locale.format));
            if (this.endDate)
                void 0;
            this.container.find("input[name=daterangepicker_end]").val(this.endDate.format(this.locale.format));
            if (this.singleDatePicker || this.endDate && (this.startDate.isBefore(this.endDate) || this.startDate.isSame(this.endDate))) {
                this.container.find("button.applyBtn").removeAttr("disabled")
            } else {
                this.container.find("button.applyBtn").attr("disabled", "disabled")
            }
        },
        move: function() {
            var popupHeight = this.container.outerHeight();
            var popupWidth = this.container.width();
            var bounds = this.element[0].getBoundingClientRect();
            var top = bounds.top;
            var left = bounds.left;
            var windowHeight = window.innerHeight;
            var drops = this.drops;
            void 0;
            void 0;
            if (drops === "down" && top + bounds.height + popupHeight + 40 > windowHeight) {
                drops = "up"
            }
            if (drops === "up" && top - popupHeight < 0) {
                drops = "down"
            }
            this.container.css({
                left: Math.min(window.innerWidth - popupWidth, Math.max(0, left)),
                right: "auto"
            });
            if (drops === "up") {
                this.container.css({
                    top: top - popupHeight - 10
                });
                this.container.removeClass("xs-tooltip-top");
                this.container.addClass("xs-tooltip-bottom")
            } else {
                this.container.css({
                    top: top + bounds.height + 10
                });
                this.container.removeClass("xs-tooltip-bottom");
                this.container.addClass("xs-tooltip-top")
            }
            this.container[this.drops === "up" ? "addClass" : "removeClass"]("dropup")
        },
        show: function(e) {
            if (this.isShowing)
                return;
            this._outsideClickProxy = $.proxy(function(e) {
                this.outsideClick(e)
            }, this);
            if (!this._keyStopHandler) {
                this._keyStopHandler = $.proxy(function(e) {
                    this.keyStopHandler(e)
                }, this)
            }
            $(document).on("mousedown.daterangepicker", this._outsideClickProxy).on("touchend.daterangepicker", this._outsideClickProxy).on("click.daterangepicker", "[data-toggle=dropdown]", this._outsideClickProxy).on("focusin.daterangepicker", this._outsideClickProxy);
            $(window).on("resize.daterangepicker", $.proxy(function(e) {
                this.move(e)
            }, this));
            document.addEventListener("keydown", this._keyStopHandler, true);
            document.addEventListener("keyup", this._keyStopHandler, true);
            this.oldStartDate = this.startDate.clone();
            this.oldEndDate = this.endDate.clone();
            this.previousRightTime = this.endDate.clone();
            this.setStartActive(true);
            this.updateView();
            this.container.show();
            this.move();
            this.element.trigger("show.daterangepicker", this);
            this.isShowing = true
        },
        applyValues: function() {
            if (!this.isShowing)
                return;
            if (!this.endDate) {
                this.startDate = this.oldStartDate.clone();
                this.endDate = this.oldEndDate.clone()
            }
            this.oldStartDate = this.startDate.clone();
            this.oldEndDate = this.endDate.clone();
            if (!this.startDate.isSame(this.oldStartDate) || !this.endDate.isSame(this.oldEndDate))
                this.callback(this.startDate, this.endDate, this.chosenLabel);
            this.updateElement()
        },
        hide: function(e) {
            if (!this.isShowing)
                return;
            this.startDate = this.oldStartDate.clone();
            this.endDate = this.oldEndDate.clone();
            $(document).off(".daterangepicker");
            $(window).off(".daterangepicker");
            if (this._keyStopHandler) {
                document.removeEventListener("keyup", this._keyStopHandler, true);
                document.removeEventListener("keydown", this._keyStopHandler, true);
                this._keyStopHandler = null
            }
            this.container.hide();
            this.element.trigger("hide.daterangepicker", this);
            this.isShowing = false;
            this.element.blur()
        },
        toggle: function(e) {
            if (this.isShowing) {
                this.hide()
            } else {
                this.show()
            }
        },
        outsideClick: function(e) {
            var target = $(e.target);
            if (e.type == "focusin" || target.closest(this.element).length || target.closest(this.container).length || target.closest(".calendar-table").length)
                return;
            this.hide();
            this.element.trigger("outsideClick.daterangepicker", this)
        },
        keyStopHandler: function(e) {
            var evtType = e.type;
            switch (e.keyCode) {
            case 27:
                if (evtType == "keydown") {
                    this._isRangeDropdownOpen = this.container.find(".ranges-dropdown.open").length > 0
                } else if (evtType == "keyup") {
                    if (!this._isRangeDropdownOpen) {
                        this.hide()
                    }
                    e.preventDefault();
                    e.stopPropagation()
                }
                break
            }
        },
        showCalendars: function() {
            this.container.addClass("show-calendar");
            this.move();
            this.element.trigger("showCalendar.daterangepicker", this)
        },
        hideCalendars: function() {
            this.container.removeClass("show-calendar");
            this.element.trigger("hideCalendar.daterangepicker", this)
        },
        hoverRange: function(e) {
            var label = e.target.getAttribute("data-range-key");
            if (label == this.locale.customRangeLabel) {
                this.updateView()
            } else {
                var dates = this.ranges[label];
                this.container.find("input[name=daterangepicker_start]").val(dates[0].format(this.locale.format));
                this.container.find("input[name=daterangepicker_end]").val(dates[1].format(this.locale.format))
            }
        },
        clickRange: function(e) {
            var label = e.target.getAttribute("data-range-key");
            this.chosenLabel = label;
            if (label == this.locale.customRangeLabel) {
                if (!this.lastCustomRange.startDate || !this.lastCustomRange.endDate) {
                    this.showCalendars()
                } else {
                    this.startDate = this.lastCustomRange.startDate.clone();
                    this.endDate = this.lastCustomRange.endDate.clone();
                    this.setStartDate(this.startDate.clone());
                    this.setEndDate(this.endDate.clone());
                    this.setStartActive(true);
                    this.updateView();
                    this.updateCalendars()
                }
            } else {
                var dates = this.ranges[label];
                this.startDate = dates[0];
                this.endDate = dates[1];
                this.startDate.startOf("day");
                this.endDate.endOf("day");
                if (!this.alwaysShowCalendars)
                    this.hideCalendars();
                this.setStartDate(this.startDate.clone());
                this.setEndDate(this.endDate.clone());
                this.setStartActive(true);
                this.updateView();
                this.updateCalendars()
            }
        },
        clickPrev: function(e) {
            var cal = $(e.target).parents(".calendar");
            if (cal.hasClass("left")) {
                this.leftCalendar.month.subtract(1, "month");
                if (this.linkedCalendars)
                    this.rightCalendar.month.subtract(1, "month")
            } else {
                this.rightCalendar.month.subtract(1, "month")
            }
            this.updateCalendars()
        },
        clickNext: function(e) {
            var cal = $(e.target).parents(".calendar");
            if (cal.hasClass("left")) {
                this.leftCalendar.month.add(1, "month")
            } else {
                this.rightCalendar.month.add(1, "month");
                if (this.linkedCalendars)
                    this.leftCalendar.month.add(1, "month")
            }
            this.updateCalendars()
        },
        hoverDate: function(e) {
            if (!$(e.target).hasClass("available"))
                return;
            var title = $(e.target).attr("data-title");
            var row = title.substr(1, 1);
            var col = title.substr(3, 1);
            var cal = $(e.target).parents(".calendar");
            var date = cal.hasClass("left") ? this.leftCalendar.calendar[row][col] : this.rightCalendar.calendar[row][col];
            if (this.endDate && !this.container.find("input[name=daterangepicker_start]").is(":focus")) {
                this.container.find("input[name=daterangepicker_start]").val(date.format(this.locale.format))
            } else if (!this.endDate && !this.container.find("input[name=daterangepicker_end]").is(":focus")) {
                this.container.find("input[name=daterangepicker_end]").val(date.format(this.locale.format))
            }
            var leftCalendar = this.leftCalendar;
            var rightCalendar = this.rightCalendar;
            var startDate = this.startDate;
            if (!this.endDate) {
                this.container.find(".calendar tbody td").each(function(index, el) {
                    if ($(el).hasClass("week"))
                        return;
                    var title = $(el).attr("data-title");
                    var row = title.substr(1, 1);
                    var col = title.substr(3, 1);
                    var cal = $(el).parents(".calendar");
                    var dt = cal.hasClass("left") ? leftCalendar.calendar[row][col] : rightCalendar.calendar[row][col];
                    if (dt.isAfter(startDate) && dt.isBefore(date) || dt.isSame(date, "day")) {
                        $(el).addClass("in-range")
                    } else {
                        $(el).removeClass("in-range")
                    }
                })
            }
        },
        clickDate: function(e) {
            if (!$(e.target).hasClass("available"))
                return;
            var title = $(e.target).attr("data-title");
            var row = title.substr(1, 1);
            var col = title.substr(3, 1);
            var cal = $(e.target).parents(".calendar");
            var date = cal.hasClass("left") ? this.leftCalendar.calendar[row][col] : this.rightCalendar.calendar[row][col];
            if (this.isStartActive) {
                if (!this.endDate || date.isAfter(this.endDate, "day")) {
                    this.endDate = null
                }
                this.setStartDate(date.clone());
                this.setStartActive(false)
            } else {
                if (date.isBefore(this.startDate, "day")) {
                    this.setEndDate(this.startDate.clone());
                    this.setStartDate(date.clone())
                } else {
                    this.setEndDate(date.clone())
                }
                void 0
            }
            if (this.autoApply) {
                this.calculateChosenLabel();
                this.clickApply()
            }
            this.updateView();
            e.stopPropagation()
        },
        calculateChosenLabel: function() {
            var customRange = true;
            var i = 0;
            for (var range in this.ranges) {
                if (this.startDate.format("DD-MM-YYYY") == this.ranges[range][0].format("DD-MM-YYYY") && this.endDate.format("DD-MM-YYYY") == this.ranges[range][1].format("DD-MM-YYYY")) {
                    customRange = false;
                    this.chosenLabel = this.container.find(".ranges-dropdown li:eq(" + i + ")").addClass("active").html();
                    break
                }
                i++
            }
            if (customRange) {
                if (this.showCustomRangeLabel) {
                    this.chosenLabel = this.container.find(".ranges-dropdown li:last").addClass("active").html();
                    this.lastCustomRange.startDate = this.startDate.clone();
                    this.lastCustomRange.endDate = this.endDate.clone()
                } else {
                    this.chosenLabel = null
                }
                this.showCalendars()
            }
        },
        clickApply: function(e) {
            this.applyValues();
            this.hide();
            this.element.trigger("apply.daterangepicker", this)
        },
        monthOrYearChanged: function(e) {
            var isLeft = $(e.target).closest(".calendar").hasClass("left")
              , leftOrRight = isLeft ? "left" : "right"
              , cal = this.container.find(".calendar." + leftOrRight);
            var month = parseInt(cal.find(".monthselect").val(), 10);
            var year = cal.find(".yearselect").val();
            if (!isLeft) {
                if (year < this.startDate.year() || year == this.startDate.year() && month < this.startDate.month()) {
                    month = this.startDate.month();
                    year = this.startDate.year()
                }
            }
            if (this.minDate) {
                if (year < this.minDate.year() || year == this.minDate.year() && month < this.minDate.month()) {
                    month = this.minDate.month();
                    year = this.minDate.year()
                }
            }
            if (this.maxDate) {
                if (year > this.maxDate.year() || year == this.maxDate.year() && month > this.maxDate.month()) {
                    month = this.maxDate.month();
                    year = this.maxDate.year()
                }
            }
            if (isLeft) {
                this.leftCalendar.month.month(month).year(year);
                if (this.linkedCalendars)
                    this.rightCalendar.month = this.leftCalendar.month.clone().add(1, "month")
            } else {
                this.rightCalendar.month.month(month).year(year);
                if (this.linkedCalendars)
                    this.leftCalendar.month = this.rightCalendar.month.clone().subtract(1, "month")
            }
            this.updateCalendars()
        },
        formInputsKeyPress: function(e) {
            var keycode = e.keyCode;
            switch (keycode) {
            case 13:
                if (!this.isStartActive) {
                    var end = moment(this.container.find('input[name="daterangepicker_end"]').val(), this.locale.format);
                    if (end.isValid()) {
                        this.container.find(".applyBtn").focus();
                        if (this.startDate && this.endDate && this.startDate.isValid() && this.endDate.isValid()) {
                            this.clickApply(e)
                        }
                    }
                } else {
                    var start = moment(this.container.find('input[name="daterangepicker_start"]').val(), this.locale.format);
                    if (start.isValid()) {
                        this.setStartActive(false);
                        this.container.find("input[name=daterangepicker_end]").focus()
                    }
                }
                break
            }
        },
        formInputsChanged: function(e) {
            var isRight = $(e.target).closest(".calendar").hasClass("right");
            var start = moment(this.container.find('input[name="daterangepicker_start"]').val(), this.locale.format);
            var end = moment(this.container.find('input[name="daterangepicker_end"]').val(), this.locale.format);
            if (start.isValid() && end.isValid()) {
                if (isRight && end.isBefore(start))
                    start = end.clone();
                this.setStartDate(start);
                this.setEndDate(end);
                if (isRight) {
                    this.container.find('input[name="daterangepicker_start"]').val(this.startDate.format(this.locale.format))
                } else {
                    this.container.find('input[name="daterangepicker_end"]').val(this.endDate.format(this.locale.format))
                }
            }
            this.updateView()
        },
        formInputsFocused: function(e) {
            var isRight = $(e.target).closest(".calendar").hasClass("right");
            if (isRight) {
                if (this.endDate) {
                    this.setEndDate(this.endDate.clone())
                }
                this.setStartActive(false)
            } else {
                this.setStartDate(this.startDate.clone());
                this.setStartActive(true)
            }
            this.updateView()
        },
        formInputsBlurred: function(e) {
            if (!this.endDate) {
                var val = this.container.find('input[name="daterangepicker_end"]').val();
                var end = moment(val, this.locale.format);
                if (end.isValid()) {
                    this.setEndDate(end);
                    this.updateView()
                }
            }
        },
        elementChanged: function() {
            if (!this.element.is("input"))
                return;
            if (!this.element.val().length)
                return;
            if (this.element.val().length < this.locale.format.length)
                return;
            var dateString = this.element.val().split(this.locale.separator)
              , start = null
              , end = null;
            if (dateString.length === 2) {
                start = moment(dateString[0], this.locale.format);
                end = moment(dateString[1], this.locale.format)
            }
            if (this.singleDatePicker || start === null || end === null) {
                start = moment(this.element.val(), this.locale.format);
                end = start
            }
            if (!start.isValid() || !end.isValid())
                return;
            this.setStartDate(start);
            this.setEndDate(end);
            this.updateView()
        },
        keydown: function(e) {
            if (e.keyCode === 9 || e.keyCode === 13) {
                this.hide()
            }
        },
        updateElement: function() {
            if (this.element.is("input") && !this.singleDatePicker && this.autoUpdateInput) {
                this.element.val(this.startDate.format(this.locale.format) + this.locale.separator + this.endDate.format(this.locale.format));
                this.element.trigger("change")
            } else if (this.element.is("input") && this.autoUpdateInput) {
                this.element.val(this.startDate.format(this.locale.format));
                this.element.trigger("change")
            }
        },
        remove: function() {
            this.container.remove();
            this.element.off(".daterangepicker");
            this.element.removeData()
        }
    };
    $.fn.daterangepicker = function(options, callback) {
        this.each(function() {
            var el = $(this);
            if (el.data("daterangepicker"))
                el.data("daterangepicker").remove();
            el.data("daterangepicker", new DateRangePicker(el,options,callback))
        });
        return this
    }
    ;
    return DateRangePicker
});
