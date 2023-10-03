
import { object, string, number, date, InferType, boolean } from 'yup';

const dataSchema = object({
    enabled: boolean().default(false).required(),
    value: number().default(0).required(),
})

const overRideDataSchema = object({
    length: dataSchema.required(),
    width: dataSchema.required(),
    height: dataSchema.required(),
    weight: dataSchema.required()
});

export interface overRideDataType extends InferType<typeof overRideDataSchema>{}

const currentDataSchema = object({
    order_id: string().required(),
    device_id: string().required(),
    length: number().required(),
    width: number().required(),
    height: number().required(),
    weight: number().required(),
})

export interface currentDataType extends InferType<typeof currentDataSchema>{}

const historyDataSchema = object({
    _id: string().required(),
    order_id: string().required(),
    device_id: string().required(),
    length: number().required(),
    width: number().required(),
    height: number().required(),
    weight: number().required(),
    createAt: date().required().default(new Date()),
    status: string().required().default("init"),
})

export interface historyDataType extends InferType<typeof historyDataSchema>{}

const connectionStateSchema = object({
    dbStatus: boolean().required(),
    socketIO: boolean().required(),
    horizontalReceiver: boolean(),
    verticalReceiver: boolean(),
    weightReceiver: boolean(),
})

export interface connectionStateType extends InferType<typeof connectionStateSchema>{}

export const socketIOSettingSchema = object({
    host: string().required().nonNullable(),
    port: number().required().nonNullable(),
})

export interface socketIOSetting extends InferType<typeof socketIOSettingSchema>{}

// export interface socketIOSetting {
//     host: string;
//     port: number;
// }

export const clientDBSettingSchema = object({
    host: string().default("localhost").required().nonNullable(),
    port: number().default(27017).required().nonNullable(),
    username: string().default("root").required().nonNullable(),
    password: string().default("root").required().nonNullable(),
    dbName: string().default("vms").required().nonNullable(),
})

export interface clientDBSetting extends InferType<typeof clientDBSettingSchema >{}

// export interface clientDBSetting {
//     host: string;
//     port: number;
//     username: string;
//     password: string;
//     dbName: string;
// }

// export interface connectionStateType {
//     dbStatus: boolean;
//     socketIO: boolean;
//     horizontalReceiver: boolean;
//     verticalReceiver: boolean;
//     weightReceiver: boolean;
// }

// export interface currentDataType {
//     order_id: string;
//     device_id: string;
//     length: number;
//     width: number;
//     height: number;
//     weight: number;
// }

// export interface overRideDataType {
//     length: {
//         enabled: boolean;
//         value: number;
//     },
//     width: {
//         enabled: boolean;
//         value: number;
//     },
//     height: {
//         enabled: boolean;
//         value: number;
//     },
//     weight: {
//         enabled: boolean;
//         value: number;
//     },
// }