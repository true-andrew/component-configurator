import {CustomComponent} from "./Classes/CustomComponent.js";
import {ComponentConfigurator} from "./Classes/Configurator.js";
import {props1, props2} from "./props.js";

const configurator = new ComponentConfigurator('configurator');

const component1 = new CustomComponent('component1', props1);
const component2 = new CustomComponent('test-btn', props2);