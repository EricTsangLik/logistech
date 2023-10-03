import convert, {Length, Mass} from 'convert';
const dimensionUnitOptions = [
    {value: "mm" as Length, text: 'mm'},
    {value: 'cm' as Length, text: 'cm'},
    {value: 'm' as Length, text: 'm'},
]

const weightUnitOptions = [
    {value: "g" as Mass, text: 'g'},
    {value: 'kg' as Mass, text: 'kg'},
]
const workModeOptions = [
    {value: "active", text: "active"},
    {value: "passive", text: "passive"},
    {value: "modbusRTU", text: "modbusRTU"},
]

const dimensionHeader = ["length", "width", "height"];
const weightHeader = ["weight"];


export { dimensionUnitOptions, dimensionHeader, weightUnitOptions, weightHeader, workModeOptions }