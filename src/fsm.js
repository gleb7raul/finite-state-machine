
class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        if (!config) {
            throw new Error("No config!");
        }
        this.config = config;
        this.state = config.initial;
        this.history = [];
        this.history.push(this.state);
        this.currentState = 0;
        this.isUndo = false;
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this.state;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        if (state in this.config.states) {
            this.state = state;
            this.currentState++; 
            if (this.isUndo) {
                this.history = this.history.slice(0, this.currentState);
                this.isUndo = false;
            }
            this.history.push(this.state);
        } else
        throw new Error("No this state in config");
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        if (event in this.config.states[this.state].transitions) {
            this.state = this.config.states[this.state].transitions[event];
            this.currentState++;
            if (this.isUndo) {
                this.history = this.history.slice(0, this.currentState);
                this.isUndo = false;
            }
            this.history.push(this.state);
        } else {
            throw new Error("No this transition in current state!")
        }
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.state = this.config.initial;
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        if (!event) {
            const arr = [];
            for (let state in this.config.states) {
                arr.push(state);
            }
            return arr;
        }
        const arr = [];
        for (let state in this.config.states) {
            if (event in this.config.states[state].transitions) {
                arr.push(state); 
            }
        }
        return arr;
    }


    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if (this.history.length <= 1) {
            return false;  
        }
        if (this.currentState === 0 ) {
            return false;
        }
        this.currentState--;
        this.state = this.history[this.currentState]; 
        this.isUndo = true;
        return true;
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if (this.history.length <= 1) {
            return false;  
        }
        if (this.currentState === this.history.length - 1 ) {
            return false;
        }
        this.currentState++;
        this.state = this.history[this.currentState]; 
        return true; 
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.history = [];
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
