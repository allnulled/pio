<template>
  <div id="PioEditor" v-on:click="setFocusOnTextearea">
    <textarea-autosize
      class="PioEditorTextarea"
      placeholder=":h"
      ref="PioEditorTextarea"
      v-model="command"
      :minHeight="0"
      :maxHeight="350"
      :width="'100%'"
      :onCtrlEnterKeyPress="onCommandKeyPress"
      :onCtrlUpKeyPress="onGoToPreviousInHistory"
      :onCtrlDownKeyPress="onGoToNextInHistory"
    />
    <pre class="DataBox" v-if="commandData">{{commandData}}</pre>
    <div class="ErrorBox" v-if="commandError">{{commandError}}</div>
    <button class="ExecuteButton" v-on:click="runCommand">▶</button>
  </div>
</template>

<script>
import TextareaAutosize from './components/TextareaAutosize.vue'
import PioParser from './pio.es6.js'
import pioCommands from './commands/pio-commands.js'

export default {
  name: 'PioEditor',
  components: {
    TextareaAutosize
  },
  data() {
    return {
      selected: {
        storage: "default_pio_storage",
        historyIndex: -1,
      },
      command: "",
      commandData: false,
      commandError: false,
      store: {},
      history: {},
      commands: {},
    }
  },
  created() {
    this.initState();
  },
  methods: {
    onCommandKeyPress($component,$e) {
      if($e.keyCode === 13 && $e.ctrlKey) {
        this.runCommand();
      }
    },
    runCommand() {
      // @todo: execute command
      this.executeCommand();
      // @todo: add command to history
      this.addCommandToHistory();
      // @todo: clean input
      this.cleanCommand();
    },
    parse(code) {
      return PioParser.parse(this.command);
    },
    parseCommand() {
      this.setCommandData(this.parse(this.command));
    },
    setCommandError(error) {
      this.commandData = false;
      this.commandError = error;
    },
    setCommandData(data) {
      this.commandData = data;
      this.commandError = false;
    },
    saveStorage() {
      localStorage[this.selected.storage] = JSON.stringify(this.getState());
    },
    loadStorage() {
      if(!(this.selected.storage in localStorage)) {
        localStorage[this.selected.storage] = JSON.stringify({store:{},commands:{},history:{}});
      }
      const state = JSON.parse(localStorage[this.selected.storage]);
      this.store = state.store;
      this.commands = state.commands;
      this.history = state.history;
      return state;
    },
    initState() {
      if(!this.state) {
        this.loadStorage();
      }
    },
    getState() {
      return {store:this.store,commands:this.commands,history:this.history};
    },
    setState(store, commands, history) {
      this.store = store;
      this.commands = commands;
      this.history = history;
    },
    executeCommand() {
      try {
        this.parseCommand();
        this.cleanCommandError();
      } catch(error) {
        this.setCommandError(error);
      }
      this.processCommands();
    },
    onGoToPreviousInHistory() {
      // @todo: move selected history index and set the command to it
      console.log("Go to previous");
    },
    onGoToNextInHistory() {
      // @todo: move selected history index and set the command to it
      console.log("Go to next");
    },
    addCommandToHistory() {
      this.saveStorage();
    },
    cleanCommand() {
      this.command = "";
    },
    cleanCommandError() {
      this.commandError = false;
    },
    setFocusOnTextearea() {
      this.$refs["PioEditorTextarea"].$el.focus();
    },
    ...Object.keys(pioCommands).reduce((r,c)=>{
      r[c] = pioCommands[c];
      r[c].bind(this);
      return r;
    }, {})
  }
}
</script>

<style>
html {
  background-color: #000;
  color: white;
  font-family: monospace;
}
body {
  padding: 0;
  margin: 0;
  box-sizing:border-box;
}
#PioEditor {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  
  margin-top: 0px;
}

#PioEditor .DataBox {
  font-size: 9px;
}

#PioEditor .ErrorBox {
  position: fixed;
  top: auto;
  left: 0px;
  bottom: 0px;
  right: 0px;
  box-sizing: border-box;
  background-color: red;
  color: yellow;
  padding: 10px;
  opacity: 0.8;
}

#PioEditor .Editor {
  width: 100%;
  box-sizing: border-box;
  margin: 0;
  padding-right: 0px;

}

#PioEditor .PioEditorTextarea {
  width: 100%;
  box-sizing: border-box;
  background-color: white;
  border: 1px solid black;
  color: #000;
}

#PioEditor .PioEditorTextarea:focus {
  outline: none;
}

#PioEditor pre {
  text-align: left;
  margin: 0;
}

#PioEditor .ExecuteButton {
  position: fixed;
  bottom: 4px;
  right: 4px;
}
</style>
