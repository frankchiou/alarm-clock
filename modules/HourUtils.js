function HoursUtils() {
    var value;
    var meridiem;

    /**
     * Converts hour value to 12 hour value
     * @param {number} h - hour value in 24 hour format
     * @returns {HoursUtils} - returns self
     */
    this.toStandardTime = function(h) {
        var me = this;

        meridiem = h < 12 ? 'AM' : 'PM';
        
        h %= 12;
        value = h === 0 ? 12 : h;

        return me;
    }

    /**
     * Converts hour value to 24 hour value
     * @param {number} h - hour value in 12 hour format
     * @param {string} m - meridiem (AM or PM)
     * @returns {HoursUtils} - returns self
     */
    this.toMilitaryTime = function (h, m) {
        var me = this;
        meridiem = m;

        // if PM and less than 12, add zero
        if (meridiem === 'PM' && h < 12) {
            value = h + 12;
        }
        // if AM and 12, 24 hour value is 0
        else if (meridiem === 'AM' && h === 12) {
            value = 0;
        }
        else {
            value = h;
        }
        
        return me;
    }

    /**
     * Converts and formats the hour value to string
     * @param {number} h - Optional. If given, converts h to string. Else, converts value.
     * @returns {object} - Returns object containing meridiem and string hour value
     */
    this.toString = function(h) {
        if (typeof h === 'number') {
            value = h;
        }

        return { 
            meridiem: meridiem, 
            value: (value < 10 ? '0' : '') + value.toString()
        };
    }

    /**
     * Outputs the hour value and meridiem
     * @returns {object} - Returns object containing meridiem and hour value
     */
    this.toValue = function() {
        return { 
            meridiem: meridiem,
            value: value 
        }
    }
}