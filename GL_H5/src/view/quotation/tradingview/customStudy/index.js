import CustomEMA from './customEMA'
import CustomMA from './customMA'
import CustomRSI from './customRSI'
import CustomWR from './customWR'
import CustomMACD from './customMACD.js'
import customKDJ from './customKDJ'

const allFunc = [CustomEMA, CustomMA, CustomRSI, CustomWR, CustomMACD, customKDJ]

export const customIndicatorsGetter = (PineJS, digit) => Promise.resolve(allFunc.map(func => func(PineJS, digit)))
