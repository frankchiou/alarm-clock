var alarm = (
    function Alarm() {
        var hours = 0;
        var minutes = 0;
        var seconds = 0;

        var isArmed = false;
        var isEditMode = false;
        var stdtime = false;

        var clockElement = document.getElementById('clock');
        var hoursInput = document.getElementById('alarm-hours');
        var minutesInput = document.getElementById('alarm-minutes');
        var secondsInput = document.getElementById('alarm-seconds');
        var meridiemInput = document.getElementById('alarm-meridiem');

        /**
         * Arms/disarms the alarm.
         * @param {boolean} value - Optional. If provided, sets the alarm. Else negates existing value.
         */
        function arm(value) {
            var alarmIndicator = document.getElementById('alarm-ind');
            var armButton = document.getElementById('arm-button');

            isArmed = typeof value === 'undefined' ? !isArmed : value;

            var visibility = 'hidden';
            var title = 'Click here to arm your alarm.';
            if (isArmed) {
                visibility = 'visible';
                title = 'Click here to disarm your alarm.';
            }
            else {
                stop();
            }

            alarmIndicator.style.visibility = visibility;
            armButton.title = title;
        }

        /**
         * Listens for enter key replaces action with toggling out of edit
         * @param {keydownevent} e 
         */
        function noSubmit(e) {
            if (e.which === 13 || e.keyCode === 13) {
                e.preventDefault();
                toggleEdit();
            }
        }

        /**
         * Checks validity of input fields and commits alarm time
         */
        function save() {
            var utils = new HoursUtils();

            // Check if the inputs are valid
            if (hoursInput.checkValidity() && minutesInput.checkValidity() && secondsInput.checkValidity()) {
                var hr = parseInt(hoursInput.value);
                hours = stdtime ? utils.toMilitaryTime(hr, meridiemInput.value).toValue().value : hr;
                minutes = parseInt(minutesInput.value);
                seconds = parseInt(secondsInput.value);

                // arm the clock after setting
                arm(true);
                return true;
            }
            
            // Simulate a click to get HTML5 validation flyouts to activate
            document.getElementById('validate').click();
            return false;
        }

        /**
         * Activates alarm actions (sound, blink, red color)
         */
        function start() {
            document.getElementById('digital').play();
            
            var elements = document.getElementsByClassName('face');
            for (let i = 0; i < elements.length; i++) {
                elements[i].classList.add('alert');
            }
            clockElement.style.border = "red 0.5vw solid";
            clockElement.classList.add('alert-border');
        }

        /**
         * Deactivates alarm actions and restores to normal
         */
        function stop() {
            document.getElementById('digital').pause();

            var elements = document.getElementsByClassName('face');
            for (let i = 0; i < elements.length; i++) {
                elements[i].classList.remove('alert');
            }
            clockElement.classList.remove('alert-border');
            clockElement.style.border = "turquoise 0.5vw solid";
        }

        /**
         * Toggles clock face from time mode to alarm input mode
         */
        function toggleEdit() {
            // if we're currently in edit mode, attempt save
            if (isEditMode) {
                var success = save();

                // check if validations were a success
                if (!success) {
                    // if not, don't do the rest of this stuff
                    return;
                }
            }

            var digits = document.getElementsByClassName('digits');
            var inputs = document.getElementsByClassName('inputs');
            var alarmButton = document.getElementById('set-button');

            var dStyle = 'block';
            var iStyle = 'none';
            var buttonText = 'Set Alarm';
            var alarmTitle = 'Click here to set your alarm.'

            isEditMode = !isEditMode;
            if (isEditMode) {
                dStyle = 'none';
                iStyle = 'block';
                buttonText = 'Save Alarm';
                alarmTitle = 'Click here to save your alarm.'
            }

            alarmButton.innerText = buttonText;
            alarmButton.title = alarmTitle;

            for (let i = 0; i < digits.length; i++) {
                digits[i].style.display = dStyle;
            }
            for (let i = 0; i < inputs.length; i++) {
                inputs[i].style.display = iStyle;
            }

            hoursInput.focus();
        }

        /**
         * Toggles alarm view between 12 hour and 24 hour mode
         */
        function toggleMode() {
            var hourVal = parseInt(hoursInput.value);
            var utils = new HoursUtils();

            if (stdtime) {
                meridiemInput.style.visibility = 'visible';
                hoursInput.min = '1';
                hoursInput.max = '12';

                var stdHour = utils.toStandardTime(hourVal).toString();
                meridiemInput.value = stdHour.meridiem;
                hoursInput.value = stdHour.value;
            }
            else {
                meridiemInput.style.visibility = 'hidden';
                hoursInput.min = '0';
                hoursInput.max = '23';
                hoursInput.value = utils.toMilitaryTime(hourVal, meridiemInput.value).toString().value;
            }
        }

        /**
         * Listener: subscribed to clock module
         * @param {number} h - hour value of current time
         * @param {number} m - minute value of current time
         * @param {number} s - second value of current time
         * @param {boolean} st - standard time boolean flag
         */
        function update(h, m, s, st) {
            // clock module owns standard time boolean
            stdtime = st;

            // check if time matches alarm
            if (hours === h && minutes === m && s === seconds && isArmed) {
                start();
            }
        }

        return {
            noSubmit: noSubmit,
            toggleEdit: toggleEdit,
            toggleMode: toggleMode,
            arm: arm,
            stop: stop,
            update: update
        }
    }
)()