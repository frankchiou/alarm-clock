var clock = (
    function Clock() {
        var stdtime = false;
        var timeControl = setInterval(getTime, 1000);
        var subscribers = [];

        /**
         * Gets the current time and sets the unit values
         */
        function getTime() {
            var time = new Date();
            var hours = time.getHours();
            var minutes = time.getMinutes();
            var seconds = time.getSeconds();

            setUnit('hours', hours);
            setUnit('minutes', minutes);
            setUnit('seconds', seconds);

            notifySubscribers(hours, minutes, seconds);
        }

        /**
         * Sets the unit of time
         * @param {string} type - The target unit to set (hours, minutes, seconds)
         * @param {number} value - Value of the time unit
         */
        function setUnit(type, value) {
            var utils = new HoursUtils();
            var text = utils.toString(value).value;

            // Convert to 12 hour if standard time true and type is hours
            if (type === 'hours' && stdtime) {
                var stdHour = utils.toStandardTime(value).toString();
                text = stdHour.value;
                document.getElementById('meridiem').innerText = stdHour.meridiem;
            }

            // update value in UI
            document.getElementById(type).innerText = text;
        }

        /**
         * Toggles the clock between 12 hour and 24 hour time
         */
        function toggleMode() {
            stdtime = !stdtime;
            getTime();
            document.getElementById('meridiem').style.visibility = stdtime ? 'visible' : 'hidden';
        }

        /**
         * Registers subscribers to this module
         * @param {object} subscriber 
         */
        function registerSubscriber(subscriber) {
            if (subscribers.indexOf(subscriber) === -1) {
                subscribers.push(subscriber);
            }    
        }

        /**
         * Removes a subscriber
         * @param {object} subscriber 
         */
        function removeSubscriber(subscriber) {
            var index = subscribers.indexOf(subscriber);
            if (index > -1) {
                subscribers.splice(index, 1);
            }
        }

        /**
         * Updates subscribers with the time values
         * @param {number} hours - hour value of current time
         * @param {number} minutes - minute value of current time
         * @param {number} seconds - second value of current time
         */
        function notifySubscribers(hours, minutes, seconds) {
            for (let i = 0; i < subscribers.length; i++) {
                subscribers[i].update(hours, minutes, seconds, stdtime);
            }
        }

        // Expose these functions
        return {
            registerSubscriber: registerSubscriber,
            removeSubscriber: removeSubscriber,
            toggleMode: toggleMode
        }
    }
)()