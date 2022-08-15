import {CustomComponent} from "./Classes/CustomComponent.js";
import {ComponentConfigurator} from "./Classes/Configurator.js";
import {props1, props2} from "./props.js";

const configurator = new ComponentConfigurator();

const component1 = new CustomComponent('component1');
const component2 = new CustomComponent('component2');

// component1.loadProperties(props1);
// component2.loadProperties(props1);

component1.renderComponent();
component2.renderComponent();

configurator.register(component1);
configurator.register(component2);