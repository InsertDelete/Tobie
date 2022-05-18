//% weight=0 color=#FF8B27 icon="\u0054" block="Tobie"
//u0054
namespace Tobie {
    let ADL_R: number = 0;
    let ADH_R: number = 0;
    let ADL_L: number = 0;
    let ADH_L: number = 0;
    let Read_LIR: number = 0;
    let Read_RIR: number = 0;
    let event_src_ir = 12;
    let event_ir_sensor = 1;
    let Motor_R: boolean = false;
    let Motor_L: boolean = false;
    let PX: number = 0;
    let PY: number = 0;
    let Force: number = 10;

    /**
    *Tobbie-II walks forward.
    */
    //% blockId="vooruit" block="Tobie wandel vooruit"
    //% blockGap=3 weight=83
    export function vooruit() {
        if (pins.digitalReadPin(DigitalPin.P8) == 1) {
            pins.digitalWritePin(DigitalPin.P13, 1)
            pins.digitalWritePin(DigitalPin.P14, 0)
        }
    }

    /**
    *Tobbie-II walks backward.
    */
    //% blockId="achteruit" block="Tobie wandel achteruit"
    //% blockGap=3  weight=82
    export function achteruit() {
        if (Force != 0) {
            pins.digitalWritePin(DigitalPin.P13, 0)
            pins.digitalWritePin(DigitalPin.P14, 1)
            Force = Force - 1;
        }
        if (pins.digitalReadPin(DigitalPin.P8) == 1) { Force = 10 }
    }

    /**
    *Tobbie-II stops walking.
    */
    //% blockId="stop" block="Tobie stop met wandelen"
    //% blockGap=3 weight=81
    export function stop() {
        pins.digitalWritePin(DigitalPin.P13, 0)
        pins.digitalWritePin(DigitalPin.P14, 0)
    }

    /**
    *Tobbie-II rotates to the right.
    */
    //% blockId="draai_rechts" block="Tobie draai naar rechts"
    //% blockGap=3  weight=73
    export function draairechts() {
        pins.digitalWritePin(DigitalPin.P15, 0)
        pins.digitalWritePin(DigitalPin.P16, 1)
        Motor_L = false
        Motor_R = true
    }

    /**
    *Tobbie-II rotates to the left.
    */
    //% blockId="draailinks" block="Tobie draai naar links"
    //% blockGap=3  weight=72
    export function draailinks() {
        pins.digitalWritePin(DigitalPin.P15, 1)
        pins.digitalWritePin(DigitalPin.P16, 0)
        Motor_L = true
        Motor_R = false
    }

    /**
    *Tobbie-II stops rotating.
    */
    //% blockId="stopdraaien" block="Tobie stop met draaien"
    //% blockGap=20 weight=71
    export function stopdraaien() {
        if (Motor_L || Motor_R) {
            if (Motor_R) {
                pins.digitalWritePin(DigitalPin.P15, 1)
                pins.digitalWritePin(DigitalPin.P16, 0)
            } else {
                pins.digitalWritePin(DigitalPin.P15, 0)
                pins.digitalWritePin(DigitalPin.P16, 1)
            }
            basic.pause(50)
        }
        if (pins.digitalReadPin(DigitalPin.P8) == 1) {
            pins.digitalWritePin(DigitalPin.P15, 0)
            pins.digitalWritePin(DigitalPin.P16, 0)
            Motor_L = false
            Motor_R = false
        }
    }

    /**
    *Read the value sensed by the right infrared sensor.
    */
    //% blockId="Read_IR_Right" block="IR lichtsterkte rechts (0-1024)"
    //% blockGap=9 weight=52
    export function Read_IR_Right(): number {
        basic.pause(100)
        ADL_R = pins.analogReadPin(AnalogPin.P2)
        pins.digitalWritePin(DigitalPin.P12, 1)
        control.waitMicros(250)
        ADH_R = pins.analogReadPin(AnalogPin.P2)
        pins.digitalWritePin(DigitalPin.P12, 0)
        if (pins.digitalReadPin(DigitalPin.P8) == 1) Read_RIR = ADH_R - ADL_R;
        return (Read_RIR)
    }

    /**
    *Read the value sensed by the left infrared sensor.
    */
    //% blockId="Read_IR_Left" block="IR lichtsterkte links (0-1024)"
    //% blockGap=20 weight=51
    export function Read_IR_Left(): number {
        basic.pause(100)
        ADL_L = pins.analogReadPin(AnalogPin.P1)
        pins.digitalWritePin(DigitalPin.P12, 1)
        control.waitMicros(250)
        ADH_L = pins.analogReadPin(AnalogPin.P1)
        pins.digitalWritePin(DigitalPin.P12, 0)

        Read_LIR = ADH_L - ADL_L;
        return (Read_LIR)
    }

    /**
    *Determine if there are obstacles on the right side.
    *@param thresholdR ; eg: 512
    */
    //% blockId="IRRight" block="IR lichtsterkte rechts groter dan %thresholdR"
    //% thresholdR.min=0 thresholdR.max=1023
    //% blockGap=9 weight=62
    export function IRRight(thresholdR: number = 512): boolean {
        basic.pause(100)
        ADL_R = pins.analogReadPin(AnalogPin.P2)
        pins.digitalWritePin(DigitalPin.P12, 1)
        control.waitMicros(250)
        ADH_R = pins.analogReadPin(AnalogPin.P2)
        pins.digitalWritePin(DigitalPin.P12, 0)

        if (((ADH_R - ADL_R) > thresholdR) && (pins.digitalReadPin(DigitalPin.P8) == 1)) {
            return (true)
        } else {
            return (false)
        }
    }

    /**
    *Determine if there are obstacles on the left side.
    *@param thresholdL ; eg: 512
    */
    //% blockId="IRLeft" block="IR lichtsterkte links groter dan %thresholdL"
    //% thresholdL.min=0 thresholdL.max=1023
    //% blockGap=20 weight=61
    export function IRLeft(thresholdL: number = 512): boolean {
        basic.pause(100)
        ADL_L = pins.analogReadPin(AnalogPin.P1)
        pins.digitalWritePin(DigitalPin.P12, 1)
        control.waitMicros(250)
        ADH_L = 0
        if (pins.digitalReadPin(DigitalPin.P8) == 1) {
            ADH_L = pins.analogReadPin(AnalogPin.P1)
            pins.digitalWritePin(DigitalPin.P12, 0)
        }
        if ((ADH_L - ADL_L) > thresholdL) {
            return (true)
        } else {
            return (false)
        }
    }

    /**
       *Tobbie-II stamps his foot for a certain number of times.
       *@param time describe parameter here, eg:5
       */
    //% blockId="stamp" block="Tobie stamp %time keer"
    //% time.min=1 time.max=100
    //% blockGap=3 weight=43
    //% advanced=true
    export function stamp(time: number): void {
        for (let i = 0; i < time; i++) {
            pins.digitalWritePin(DigitalPin.P13, 1)
            pins.digitalWritePin(DigitalPin.P14, 0)
            basic.pause(150)
            pins.digitalWritePin(DigitalPin.P13, 0)
            pins.digitalWritePin(DigitalPin.P14, 1)
            basic.pause(150)
        }
        pins.digitalWritePin(DigitalPin.P13, 0)
        pins.digitalWritePin(DigitalPin.P14, 0)
    }

    /**
       *Tobbie-II shakes his head for a certain number of times.
       *@param time describe parameter here, eg:5
       */
    //% blockId="schudthoofd" block="Tobie schud je hoofd %time keer"
    //% time.min=1 time.max=100
    //% blockGap=3 weight=42
    //% advanced=true
    export function schudthoofd(time: number): void {
        for (let i = 0; i < time; i++) {
            pins.digitalWritePin(DigitalPin.P15, 1)
            pins.digitalWritePin(DigitalPin.P16, 0)
            basic.pause(250)
            pins.digitalWritePin(DigitalPin.P15, 0)
            pins.digitalWritePin(DigitalPin.P16, 1)
            basic.pause(250)
        }
        pins.digitalWritePin(DigitalPin.P15, 0)
        pins.digitalWritePin(DigitalPin.P16, 0)
    }

    /**
        *Tobbie-II repeats the dance for for a certain number of times.
        *@param time describe parameter here, eg:5
        */
    //% blockId="dans" block="Tobie dans %time keer"
    //% time.min=1 time.max=100
    //% blockGap=20 weight=41
    //% advanced=true
    export function dans(time: number): void {
        for (let i = 0; i < time; i++) {
            pins.digitalWritePin(DigitalPin.P13, 0)
            pins.digitalWritePin(DigitalPin.P14, 1)
            pins.digitalWritePin(DigitalPin.P15, 0)
            pins.digitalWritePin(DigitalPin.P16, 1)
            basic.pause(250)
            pins.digitalWritePin(DigitalPin.P13, 1)
            pins.digitalWritePin(DigitalPin.P14, 0)
            pins.digitalWritePin(DigitalPin.P15, 1)
            pins.digitalWritePin(DigitalPin.P16, 0)
            basic.pause(250)
        }
        pins.digitalWritePin(DigitalPin.P13, 0)
        pins.digitalWritePin(DigitalPin.P14, 0)
        pins.digitalWritePin(DigitalPin.P15, 0)
        pins.digitalWritePin(DigitalPin.P16, 0)
    }
}

