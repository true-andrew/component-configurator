export default {
  "title": "Component Options",
  "htmlName": "fieldset",
  "children": [
    {
      "title": "Visual",
      "htmlName": "fieldset",
      "children": [
        {
          "title": "Dimensions",
          "htmlName": "fieldset",
          "children": [
            {
              "title": "Width",
              "htmlName": "input",
              "cssName": "width",
              "value": 500,
              "type": "number",
              "units": "px"
            },
            {
              "title": "Height",
              "htmlName": "input",
              "cssName": "height",
              "value": 500,
              "type": "number",
              "units": "px"
            }
          ]
        },
        {
          "title": "Borders",
          "htmlName": "fieldset",
          "children": [
            {
              "title": "Border Radius",
              "htmlName": "input",
              "cssName": "borderRadius",
              "value": 25,
              "type": "number",
              "units": "px"
            },
            {
              "title": "Border Color",
              "htmlName": "input",
              "cssName": "borderColor",
              "value": "#FF0000",
              "type": "color",
              "units": ""
            },
            {
              "title": "Border width",
              "htmlName": "input",
              "cssName": "borderWidth",
              "value": 1,
              "type": "number",
              "units": "px"
            },
            {
              "title": "Border Style",
              "htmlName": "select",
              "cssName": "borderStyle",
              "value": "solid",
              "units": "",
              "type": "select",
              "children": [
                {
                  "title": "solid",
                  "htmlName": "option"
                },
                {
                  "title": "dashed",
                  "htmlName": "option",
                },
                {
                  "title": "dotted",
                  "htmlName": "option"
                },
                {
                  "title": "unset",
                  "htmlName": "option"
                }
              ]
            }
          ]
        },
        {
          "title": "Indents",
          "htmlName": "fieldset",
          "children": [
            {
              "title": "Padding",
              "htmlName": "input",
              "cssName": "padding",
              "value": 25,
              "type": "number",
              "units": "px"
            },
            {
              "title": "Margin",
              "htmlName": "input",
              "cssName": "margin",
              "value": 5,
              "type": "number",
              "units": "px"
            }
          ]
        },
        {
          "title": "Background",
          "htmlName": "fieldset",
          "children": [
            {
              "title": "Background Color",
              "htmlName": "input",
              "cssName": "backgroundColor",
              "value": '#00FF00',
              "type": "color",
              "units": ""
            }
          ]
        }
      ]
    }
  ]
}