'use client';

import React from 'react'
// import '@styles/work.css';
import { useState, useEffect, useReducer } from 'react'
import { useSession} from "next-auth/react";
import { useRouter } from 'next/navigation';
import { io, Socket } from "socket.io-client";
// import moment from 'moment';
import { Toggle } from 'react-daisyui'
import Orderstat from '@components/Orderstat';
import Devicestat from '@components/Devicestat';
import tableHeader from '@components/tableHeader';
import tableBody from '@components/tableBody';
import formInput from '@components/formInput';
import convert, {Length, Mass} from 'convert';
import { packageProgressState } from '@type/progressState';
import { dimensionUnitOptions, dimensionHeader, weightUnitOptions, weightHeader, workModeOptions } from '@type/shareVariable';
import { ServerToClientEvents, ClientToServerEvents, InterServerEvents, SocketData } from "@type/socketioEventsType";
import { overRideDataType, currentDataType, connectionStateType, socketIOSetting, clientDBSetting, clientDBSettingSchema, historyDataType} from '@type/dataType';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {v4 as uuidv4} from 'uuid';
import { now } from 'next-auth/client/_utils';

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(`http://localhost:${process.env.APP_PORT}`);

declare global {
    interface Window {
        dbSetting:any;
    }
}

const page = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const [dimensionUnit, setdimensionUnit] = useState<Length>(dimensionUnitOptions[0].value as Length);
    const [weightUnit, setweightUnit] = useState<Mass>(weightUnitOptions[0].value as Mass);
    const [connectionState, setconnectionState] = useState<connectionStateType>({
        dbStatus: false,
        socketIO: false,
        horizontalReceiver: false,
        verticalReceiver: false,
        weightReceiver: false,
        });
    const [capture, setcapture] = useState<Boolean>(false);
    const [overRideData, setoverRideData] = useState<overRideDataType>({
        length: {
            enabled: false,
            value: 0
        },
        width: {
            enabled: false,
            value: 0
        },
        height: {
            enabled: false,
            value: 0
        },
        weight: {
            enabled: false,
            value: 0
        },
    });
    const [currentData, setcurrentData] = useState<currentDataType>({
        order_id: "testing",
        device_id: "testing",
        length: 0,
        width: 0,
        height: 0,
        weight: 0,
    });
    const [historydata, sethistorydata] = useState<Array<historyDataType>>([]);
    const dataEvents = ["lengthData", "widthData", "heightData", "weightData"];

    // const historydata = [{
    //     _id: "test",
    //     device_id: "testing",
    //     weight: 4000,
    //     height: 1000,
    //     width: 2000,
    //     length: 3000,
    //     createAt: "2023-08-14T16:17:57+08:00",
    //     status: "final",
    // },
    // {
    //     _id: "test",
    //     device_id: "testing",
    //     weight: 4000,
    //     height: 1000,
    //     width: 2000,
    //     length: 3000,
    //     createAt: "2023-08-14T16:17:57+08:00",
    //     status: "init",
    // }];

    // useEffect(() => {
    //     // if (session?.user === undefined){
    //     //     return router.push('/');
    //     // };
    // }, []);
    let socket: Socket<ServerToClientEvents, ClientToServerEvents>;
    useEffect(() => socketInitializer(), []);

    const socketInitializer = () => {
        socket = io(`http://localhost:3003`);
        
        function onConnect() {
            console.log(`Socketio connected`);
            const temp = Object.assign({...connectionState}, {socketIO: true});
            setconnectionState(temp);
            console.log(temp);
        };

        function onDisconnect(){
            console.log(`Socketio disconnected`)
            const temp = Object.assign({...connectionState}, {socketIO: false});
            setconnectionState(temp);
        };


        function onCurrentData(data: Partial<currentDataType>){
            const getkey= Object.keys(data)[0];
            if (!overRideData[getkey as keyof overRideDataType].enabled) { 
                const temp = Object.assign({...currentData}, data);
                setcurrentData(temp);
            }
            else {
                const temp2: Partial<currentDataType> = { [getkey as keyof currentDataType]: overRideData[getkey as keyof overRideDataType].value} ;
                const temp = Object.assign({...currentData}, temp2);
                setcurrentData(temp);
            }
            //console.log(data);
        };

        function onHealthCheck(data: Object){
            const temp = Object.assign({...connectionState}, data);
            setconnectionState(temp);
        }

        dataEvents.forEach((v: string, i) => {
            socket.on(v as keyof ServerToClientEvents, onCurrentData);
            //console.log("hi",i,v);
        })

        socket.on('connect', onConnect);
        socket.on("disconnect", onDisconnect);
        socket.on("healthCheck", onHealthCheck);
        socket.io.on("ping", () => {
            console.log("ping");
        });
        socket.on("heightData", (height)=>  {
            console.log(`test2 receive ${height}`);
        })

          

        return () => {
            socket.off('connect', onConnect);
            socket.off("disconnect", onDisconnect);
            dataEvents.forEach((v, i) => {
                socket.off(v as keyof ServerToClientEvents, onCurrentData);
            })
            socket.off("healthCheck", onHealthCheck);

        };
    };

    const { register, handleSubmit, formState: { errors }, reset, getFieldState, getValues } = useForm({
        defaultValues: clientDBSettingSchema.cast({
            host: 'localhost',
            port: 27017,
            username: 'root',
            password: 'root',
            dbName: 'vms',
        }),
        resolver: yupResolver(clientDBSettingSchema),
      });
    
    function onOverrideData(data: Partial<overRideDataType>){
        // console.log(data);
        const temp = Object.assign({...overRideData}, data);
        setoverRideData(temp);
        const getkey= Object.keys(data)[0];
        const temp2: Partial<currentDataType> = { [getkey as keyof currentDataType]: data[getkey as keyof overRideDataType]?.value} ;
        // console.log(temp2)
        const temp3 = Object.assign({...currentData}, temp2);
        setcurrentData(temp3);
    };

    function saveCurrentData(){
        if (connectionState.dbStatus){
            // await 
        }
        const temp = {
            //_id: currentData._id,
            order_id: currentData.order_id,
            device_id: currentData.device_id,
            weight: currentData.weight,
            height: currentData.height,
            width: currentData.width,
            length: currentData.length,
            createAt: new Date().toLocaleString(),
            status: "init" ,}
        //this.state.historydata.push(temp);
        sethistorydata(cur => [...cur, temp])
        setcapture(false);
        //getData();
        console.log(temp.width);
        return ;
    };
    return (
        <div className='flex w-full max-h-screen flex-col lg:flex-row'>
            <div className="grid flex-auto card rounded-box place-items-center stats stats-vertical shadow text-primary-content">
                <div>
                    {capture? (
                        <button className="btn btn-error disabled:btn-error" disabled={true}>
                            <span className="loading loading-spinner"></span>
                            running
                        </button>
                    ):(<button className="btn btn-success" onClick={(e)=>{setcapture(true);}} value={capture}>Capture</button>)}
                </div>
                {Object.keys(currentData).map(block => Orderstat({
                    stat_title: block, 
                    stat_value: 
                        dimensionHeader.includes(block) ? convert(currentData[block as keyof currentDataType] as number, 'mm').to(dimensionUnit as any):
                        weightHeader.includes(block) ? convert(currentData[block as keyof currentDataType] as number, 'g').to(weightUnit):
                        currentData[block as keyof currentDataType], 
                    stat_desc: 
                        dimensionHeader.includes(block) ? 
                        <select name="" id="" className='select select-info w-15' onChange={(e)=>setdimensionUnit(e.target.value as Length) } value={dimensionUnit as any} >
                            {dimensionUnitOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.text}
                                </option>))}
                        </select>
                        : weightHeader.includes(block) ? 
                        <select name="" id="" className='select select-info w-15' onChange={(e)=>setweightUnit(e.target.value as Mass) } value={weightUnit as any}  >
                            {weightUnitOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.text}
                                </option>))}
                        </select> : 
                        "",
                    stat_actions: 
                        dimensionHeader.includes(block) ?
                        <div>
                            <div className="form-control tooltip" data-tip="Override" >
                                <label className="label cursor-pointer">
                                <input type="checkbox" className="toggle toggle-primary" value={overRideData[block as keyof overRideDataType].enabled.toString()} onChange={(e)=>{
                                    const temp = { [block]: {enabled: e.target.checked, value: e.target.checked ? overRideData[block as keyof overRideDataType].value: 0}};
                                    onOverrideData(temp);
                                    }}/>
                                </label>
                            </div> 
                            <input type="number" placeholder="value" pattern="[0-9]*" className="input input-bordered w-50" disabled={!overRideData[block as keyof overRideDataType].enabled} 
                            value={convert(overRideData[block as keyof overRideDataType].value as number, "mm").to(dimensionUnit)} onChange={(e)=>{
                                const temp = {[block]: { enabled: overRideData[block as keyof overRideDataType].enabled, value: convert(e.target.valueAsNumber, dimensionUnit).to("mm")}};
                                onOverrideData(temp);
                            }} />
                        </div>:
                    weightHeader.includes(block) ?
                    <div>
                        <div className="form-control tooltip" data-tip="Override" >
                            <label className="label cursor-pointer">
                            <input type="checkbox" className="toggle toggle-primary" value={overRideData[block as keyof overRideDataType].enabled.toString()} onChange={(e)=>{
                                const temp = { [block]: {enabled: e.target.checked, value: e.target.checked ? overRideData[block as keyof overRideDataType].value: 0}};
                                onOverrideData(temp);
                                }}/>
                            </label>
                        </div>
                        <input type="number" placeholder="value" pattern="[0-9]*" className="input input-bordered w-50" disabled={!overRideData[block as keyof overRideDataType].enabled} 
                        value={convert(overRideData[block as keyof overRideDataType].value, "g").to(weightUnit)} onChange={(e)=>{
                            const temp = { [block]: {enabled: overRideData[block as keyof overRideDataType].enabled, value: convert(e.target.valueAsNumber, weightUnit).to("g")}};
                            onOverrideData(temp);
                        }} />
                    </div>
                    :""
                    }))}
            </div>
            <div className='divider divider-vertical lg:divider-horizontal'></div>
            <div className='flex flex-grow w-2/3 card rounded-box'>
                <div className='stats stats-horizontal shadow text-primary-content w-full h-1/6'>
                {Object.keys(connectionState).map(block => Devicestat({stat_title: block, stat_value: connectionState[block as keyof connectionStateType]?(
                        <div className='badge badge-primary badge-md tooltip' data-tip="ready"></div>
                    ):(
                        <div className='tooltip' data-tip="waiting">
                            <span className="loading loading-ring loading-md"></span>
                        </div> 
                    )
                    , stat_desc:
                    block === 'dbStatus' ?
                    <div>
                        <button className='btn btn-info' onClick={()=>window.dbSetting.showModal()}>Setting</button> 
                        <dialog id="dbSetting" className="modal">
                            <form method="dialog" className="modal-box" onSubmit={handleSubmit((d) => console.log(d))}>
                                <p className='text'>Client Database Setting</p>
                                {/* {Object.keys(clientDBSetting).map(block => formInput({form_label: block, form_placeholder: clientDBSetting[block as keyof clientDBSetting] as string, form_type: typeof clientDBSetting[block as keyof clientDBSetting] === "string" ? "text" : "number" }))} */}
                                {/* {Object.keys(clientDBSettingSchema).map(block => formInput({form_label: block, form_register: {...register(block as keyof clientDBSetting)} , form_type: typeof clientDBSetting[block as keyof clientDBSetting] === "string" ? "text" : "number" }))} */}
                                <label className="label">
                                    <span className='label-text'>Host</span>
                                </label>
                                <input {...register("host")} type="text" className="input input-bordered input-primary w-full max-w-xs" />
                                <label className="label">
                                    <span className='label-text'>Port</span>
                                </label>
                                <input {...register("port")} type="number" className="input input-bordered input-primary w-full max-w-xs" />
                                <label className="label">
                                    <span className='label-text'>Username</span>
                                </label>
                                <input {...register("username")} type="text" className="input input-bordered input-primary w-full max-w-xs" />
                                <label className="label">
                                    <span className='label-text'>Password</span>
                                </label>
                                <input {...register("password")} type="password" className="input input-bordered input-primary w-full max-w-xs" />
                                <label className="label">
                                    <span className='label-text'>Database</span>
                                </label>
                                <input {...register("dbName")} type="text" className="input input-bordered input-primary w-full max-w-xs" />
                                
                                <p className="py-4">Press ESC key or click the button below to close</p>
                                <div className="modal-action">
                                {/* if there is a button in form, it will close the modal */}
                                <button className="btn" type='submit'>Save</button>
                                </div>
                            </form>
                        </dialog>
                    </div>
                    :
                    
                    // <select name="" id="" className='select select-info w-50' onChange={(e)=>{
                    //         setworkMode(e.target.value);
                    //         socket.emit("")
                    //         } } value={workMode as any} >
                    //     {workModeOptions.map(option => (
                    //         <option key={option.value} value={option.value}>
                    //             {option.text}
                    //         </option>))}
                    // </select> :
                    ""}))}
                </div>
                <div className='divider '>Log</div>
                
                <div className='overflow-y-auto w-full h-full row-start-auto'>
                {!historydata.length ? 
                    <></> 
                    : 
                    <table className='table'>
                        <thead>
                            <tr>
                                {tableHeader(historydata)}
                            </tr>
                        </thead>
                        <tbody>
                            {tableBody(historydata.map( obj => {
                                obj.length = convert(obj.length, "mm").to(dimensionUnit);
                                obj.width = convert(obj.width, "mm").to(dimensionUnit);
                                obj.height = convert(obj.height, "mm").to(dimensionUnit);
                                obj.weight = convert(obj.weight, "g").to(weightUnit);
                                obj.status = <div className="radial-progress" 
                                    style={{"--value":packageProgressState[obj.status as any]}}>
                                        {packageProgressState[obj.status as any]}%</div>;
                                
                                return obj;
                                }))}
                        </tbody>
                    </table>}
                </div>
            </div>
        </div>
      )
}

export default page
