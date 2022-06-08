import React, { Component } from 'react';

export class WSTest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            connection: 'no'
        };

        this.connectToPump.bind(this);
    }

    // static displayName = WSTest.name;

    // Pair pump
    // onConnect event
    // onDisconnect event
    // upload

    // when to pass auth?
    // how to validate correct pump?
    // how to handle 

    onPumpConnect = (event) => {
        var port = event.target
        this.setState({ connection: "connected" });
        console.log(port);
        console.log('connect');
    }

    onPumpDisconnect = (event) => {
        var port = event.target
        this.setState({connection: "disconnected"});
        console.log(port);
        console.log(event);
    }

    async onTest() {
        navigator.serial.getPorts({ filters: [{ usbVendorId: 0x0483, },], })
            .then(async ports => {
                if (ports.length === 0) {
                    console.log('no ports found');
                }
                else {
                    var port = ports[0];

                    await port.open({ baudRate: 9600 });
                    const reader = port.readable.getReader();
                    const writer = port.writable.getWriter();
                    const data = new Uint8Array([85, 0x52, 0, 0, 0, 0, 0, 0, 0x52]).buffer;
                    await writer.write(data);

                    try {
                        while (true) {
                            const res = await reader.read();
                            console.log(res);

                            if (res.done) {
                                // Allow the serial port to be closed later.
                                reader.releaseLock();
                                break;
                            }
                            if (res.value) {
                                console.log(res.value);
                            }
                        }
                    } catch (error) {
                        console.error(error);
                    }

                    await port.close();
                }
            })
    }

    connectToPump = () => {
        navigator.serial.requestPort({ filters: [{ usbVendorId: 0x0483, },], });
        this.setState({ connection: "yes" });
    }

    render() {

        navigator.serial.addEventListener('connect', this.onPumpConnect);
        navigator.serial.addEventListener('disconnect', this.onPumpDisconnect);

        return (
            <div>
                <h1 onClick={this.connectToPump}>Connect to pump</h1>
                <h1 onClick={this.onTest}>Send test data</h1>
                <h1>Pump connected: {this.state.connection}</h1>
                <h3>WebSerial Support:{navigator.serial ? "yes" : "no"}</h3>
                <h3>WebUSB Support:{navigator.usb ? "yes" : "no"}</h3>
            </div>
        );
    }
}

export default WSTest;



