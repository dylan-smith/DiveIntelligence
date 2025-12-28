(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/utility/utility.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ceilingWithThreshold",
    ()=>ceilingWithThreshold,
    "floorWithThreshold",
    ()=>floorWithThreshold
]);
function ceilingWithThreshold(ceiling, threshold = 0.000001) {
    return Math.ceil(ceiling - threshold);
}
function floorWithThreshold(floor, threshold = 0.000001) {
    return Math.floor(floor + threshold);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/dive-planner-service/BreathingGas.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BreathingGas",
    ()=>BreathingGas
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utility$2f$utility$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/utility/utility.ts [app-client] (ecmascript)");
;
class BreathingGas {
    name;
    oxygen;
    helium;
    nitrogen;
    diveSettings;
    description;
    compositionDescription;
    maxDepthPO2;
    maxDepthPO2Deco;
    maxDepthEND;
    minDepth;
    maxDecoDepth;
    constructor(name, oxygen, helium, nitrogen, diveSettings){
        this.name = name;
        this.oxygen = oxygen;
        this.helium = helium;
        this.nitrogen = nitrogen;
        this.diveSettings = diveSettings;
        this.diveSettings.subscribeToChanges(()=>this.onDiveSettingsChanged());
        this.updateDetails();
    }
    onDiveSettingsChanged() {
        this.updateDetails();
    }
    static create(oxygen, helium, nitrogen, settings) {
        const gas = new BreathingGas('Custom', oxygen, helium, nitrogen, settings);
        const standardGas = BreathingGas.StandardGases.find((g)=>g.isEquivalent(gas));
        if (standardGas !== undefined) {
            return new BreathingGas(standardGas.name, standardGas.oxygen, standardGas.helium, standardGas.nitrogen, settings);
        }
        return gas;
    }
    updateDetails() {
        this.description = this.calcDescription();
        this.compositionDescription = this.calcCompositionDescription();
        this.maxDepthPO2 = this.calcMaxDepthPO2();
        this.maxDepthPO2Deco = this.calcMaxDepthPO2Deco();
        this.maxDepthEND = this.calcMaxDepthEND();
        this.minDepth = this.calcMinDepth();
        this.maxDecoDepth = this.calcMaxDecoDepth();
    }
    static StandardGases;
    static GenerateStandardGases(settings) {
        this.StandardGases = [
            new BreathingGas('Air', 21, 0, 79, settings),
            new BreathingGas('Nitrox 32', 32, 0, 68, settings),
            new BreathingGas('Oxygen', 100, 0, 0, settings),
            new BreathingGas('Helitrox 25/25', 25, 25, 50, settings),
            new BreathingGas('Helitrox 21/35', 21, 35, 44, settings),
            new BreathingGas('Trimix 18/45', 18, 45, 37, settings),
            new BreathingGas('Trimix 15/55', 15, 55, 30, settings),
            new BreathingGas('Trimix 12/60', 12, 60, 28, settings),
            new BreathingGas('Trimix 10/70', 10, 70, 20, settings),
            new BreathingGas('Nitrox 50', 50, 0, 50, settings),
            new BreathingGas('Helitrox 35/25', 35, 25, 40, settings)
        ];
    }
    static getOptimalDecoGas(depth, settings) {
        const atm = depth / 10 + 1;
        const oxygen = Math.min(100, (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utility$2f$utility$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["floorWithThreshold"])(settings.decoPO2Maximum * 100 / atm));
        let targetPN2 = (settings.ENDErrorThreshold / 10 + 1) * 79;
        if (settings.isOxygenNarcotic) {
            const targetNarcotic = (settings.ENDErrorThreshold / 10 + 1) * 100;
            targetPN2 = targetNarcotic - oxygen * atm;
        }
        let nitrogen = targetPN2 / atm;
        const helium = Math.max(0, (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utility$2f$utility$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ceilingWithThreshold"])(100 - oxygen - nitrogen));
        nitrogen = 100 - oxygen - helium;
        return BreathingGas.create(oxygen, helium, nitrogen, settings);
    }
    calcDescription() {
        return `${this.name} (${this.calcCompositionDescription()})`;
    }
    calcCompositionDescription() {
        return `O<sub>2</sub>: ${this.oxygen}%, He: ${this.helium}%, N<sub>2</sub>: ${this.nitrogen}%`;
    }
    calcMaxDepthPO2() {
        return Math.floor(this.diveSettings.workingPO2Maximum * 1000 / this.oxygen - 10);
    }
    calcMaxDepthPO2Deco() {
        return Math.floor(this.diveSettings.decoPO2Maximum * 1000 / this.oxygen - 10);
    }
    calcMaxDepthEND() {
        if (this.diveSettings.isOxygenNarcotic) {
            return Math.floor((this.diveSettings.ENDErrorThreshold + 10) * 100 / (this.nitrogen + this.oxygen) - 10);
        } else {
            return Math.floor(790 * ((this.diveSettings.ENDErrorThreshold + 10) / 10) / this.nitrogen - 10);
        }
    }
    calcMinDepth() {
        return Math.max(0, (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utility$2f$utility$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ceilingWithThreshold"])(this.diveSettings.pO2Minimum * 1000 / this.oxygen - 10));
    }
    calcMaxDecoDepth() {
        return Math.min(this.calcMaxDepthPO2Deco(), this.calcMaxDepthEND());
    }
    getPO2(depth) {
        return (depth / 10 + 1) * (this.oxygen / 100);
    }
    getPHe(depth) {
        return (depth / 10 + 1) * (this.helium / 100);
    }
    getPN2(depth) {
        return (depth / 10 + 1) * (this.nitrogen / 100);
    }
    getEND(depth) {
        if (this.diveSettings.isOxygenNarcotic) {
            return Math.max(0, (this.getPN2(depth) + this.getPO2(depth) - 1) * 10);
        }
        return Math.max(0, (this.getPN2(depth) / 0.79 - 1) * 10);
    }
    isEquivalent(other) {
        return this.oxygen === other.oxygen && this.helium === other.helium && this.nitrogen === other.nitrogen;
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/utility/formatters.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "colonDuration",
    ()=>colonDuration,
    "humanDuration",
    ()=>humanDuration
]);
function humanDuration(value) {
    const minutes = Math.floor(value / 60);
    const seconds = Math.round(value % 60);
    let result = `${minutes > 0 ? minutes + ' min' : ''}${seconds > 0 ? ' ' + seconds + ' sec' : ''}`;
    result = result.trim();
    if (minutes + seconds === 0) {
        result = '0 sec ';
    }
    return result;
}
function colonDuration(value) {
    const hours = Math.floor(value / 3600);
    const minutes = Math.floor((value - hours * 3600) / 60);
    const seconds = Math.floor(value % 60);
    let result = '';
    if (hours > 0) {
        result += hours + ':';
        result += minutes < 10 ? '0' + minutes : minutes;
        result += ':';
    } else {
        result += minutes + ':';
    }
    result += seconds < 10 ? '0' + seconds : seconds;
    return result;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/dive-planner-service/DiveSegment.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DiveSegment",
    ()=>DiveSegment
]);
class DiveSegment {
    StartTimestamp;
    EndTimestamp;
    Title;
    Description;
    StartDepth;
    EndDepth;
    Gas;
    Icon;
    settings;
    constructor(StartTimestamp, EndTimestamp, Title, Description, StartDepth, EndDepth, Gas, Icon, settings){
        this.StartTimestamp = StartTimestamp;
        this.EndTimestamp = EndTimestamp;
        this.Title = Title;
        this.Description = Description;
        this.StartDepth = StartDepth;
        this.EndDepth = EndDepth;
        this.Gas = Gas;
        this.Icon = Icon;
        this.settings = settings;
    }
    clone() {
        return new DiveSegment(this.StartTimestamp, this.EndTimestamp, this.Title, this.Description, this.StartDepth, this.EndDepth, this.Gas, this.Icon, this.settings);
    }
    getDuration() {
        return this.EndTimestamp - this.StartTimestamp;
    }
    getAverageDepth() {
        if (this.StartDepth === this.EndDepth) {
            return this.StartDepth;
        }
        const travelAverageDepth = (this.StartDepth + this.EndDepth) / 2;
        const travelTime = this.getTravelDuration();
        const bottomTime = this.getDuration() - travelTime;
        return (travelAverageDepth * travelTime + this.EndDepth * bottomTime) / this.getDuration();
    }
    getDepth(time) {
        if (time <= this.StartTimestamp) {
            return this.StartDepth;
        }
        if (time >= this.EndTimestamp) {
            return this.EndDepth;
        }
        const travelEnd = this.StartTimestamp + this.getTravelDuration();
        if (time >= travelEnd) {
            return this.EndDepth;
        }
        return this.StartDepth + (this.EndDepth - this.StartDepth) * (time - this.StartTimestamp) / (travelEnd - this.StartTimestamp);
    }
    getTravelDuration() {
        if (this.StartDepth === this.EndDepth) {
            return 0;
        }
        if (this.StartDepth < this.EndDepth) {
            const descentRatePerMeter = 60 / this.settings.descentRate;
            return Math.round((this.EndDepth - this.StartDepth) * descentRatePerMeter);
        }
        if (this.EndDepth < this.StartDepth) {
            const ascentRatePerMeter = 60 / this.settings.ascentRate;
            return Math.round((this.StartDepth - this.EndDepth) * ascentRatePerMeter);
        }
        return 0; // should never happen
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/dive-planner-service/DiveSegmentFactory.service.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DiveSegmentFactoryService",
    ()=>DiveSegmentFactoryService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utility$2f$formatters$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/utility/formatters.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$dive$2d$planner$2d$service$2f$DiveSegment$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/dive-planner-service/DiveSegment.ts [app-client] (ecmascript)");
;
;
class DiveSegmentFactoryService {
    settings;
    constructor(settings){
        this.settings = settings;
    }
    createEndDiveSegment(startTime, depth, gas) {
        const ascentTime = this.getTravelTime(depth, 0);
        const ascentTimeDuration = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utility$2f$formatters$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["humanDuration"])(ascentTime);
        const endTime = startTime + ascentTime;
        return new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$dive$2d$planner$2d$service$2f$DiveSegment$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DiveSegment"](startTime, endTime, 'Surface', `Ascent time: ${ascentTimeDuration} @ ${this.settings.ascentRate}m/min`, depth, 0, gas, 'done', this.settings);
    }
    createStartDiveSegment(gas) {
        return new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$dive$2d$planner$2d$service$2f$DiveSegment$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DiveSegment"](0, 0, 'Start Dive', gas.description, 0, 0, gas, 'scuba_diving', this.settings);
    }
    createDepthChangeSegment(startTime, previousDepth, newDepth, gas) {
        const travelTime = this.getTravelTime(previousDepth, newDepth);
        const endTime = startTime + travelTime;
        const title = newDepth > previousDepth ? `Descend to ${newDepth}m` : `Ascend to ${newDepth}m`;
        const description = newDepth > previousDepth ? `Descent time: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utility$2f$formatters$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["humanDuration"])(travelTime)} @ ${this.settings.descentRate}m/min` : `Ascent time: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utility$2f$formatters$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["humanDuration"])(travelTime)} @ ${this.settings.ascentRate}m/min`;
        const icon = newDepth > previousDepth ? 'arrow_downward' : 'arrow_upward';
        return new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$dive$2d$planner$2d$service$2f$DiveSegment$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DiveSegment"](startTime, endTime, title, description, previousDepth, newDepth, gas, icon, this.settings);
    }
    createGasChangeSegment(startTime, newGas, depth) {
        const title = 'Switch Gas';
        const description = newGas.description;
        return new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$dive$2d$planner$2d$service$2f$DiveSegment$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DiveSegment"](startTime, startTime, title, description, depth, depth, newGas, 'air', this.settings);
    }
    createMaintainDepthSegment(startTime, depth, duration, gas) {
        const endTime = startTime + duration;
        const title = `Maintain Depth at ${depth}m`;
        const description = `Time: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utility$2f$formatters$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["humanDuration"])(duration)}`;
        const icon = 'arrow_forward';
        return new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$dive$2d$planner$2d$service$2f$DiveSegment$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DiveSegment"](startTime, endTime, title, description, depth, depth, gas, icon, this.settings);
    }
    getTravelTime(previousDepth, newDepth) {
        if (newDepth > previousDepth) {
            return Math.round((newDepth - previousDepth) * (60 / this.settings.descentRate));
        } else {
            return Math.round((previousDepth - newDepth) * (60 / this.settings.ascentRate));
        }
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/dive-planner-service/Tissue.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Tissue",
    ()=>Tissue
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utility$2f$utility$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/utility/utility.ts [app-client] (ecmascript)");
;
class Tissue {
    tissueNumber;
    n2HalfLife;
    a_n2;
    b_n2;
    heHalfLife;
    a_he;
    b_he;
    tissueByTime;
    n2DeltaMultiplier;
    heDeltaMultiplier;
    constructor(tissueNumber, n2HalfLife, a_n2, b_n2, heHalfLife, a_he, b_he){
        this.tissueNumber = tissueNumber;
        this.n2HalfLife = n2HalfLife;
        this.a_n2 = a_n2;
        this.b_n2 = b_n2;
        this.heHalfLife = heHalfLife;
        this.a_he = a_he;
        this.b_he = b_he;
        this.tissueByTime = new Map();
        this.n2DeltaMultiplier = 0;
        this.heDeltaMultiplier = 0;
        this.ENVIRONMENT_PN2 = 0.79;
        this.ENVIRONMENT_PHE = 0.0;
        this.MAX_NDL = 3600 * 5;
        this.tissueByTime.set(0, {
            PN2: this.ENVIRONMENT_PN2,
            PHe: this.ENVIRONMENT_PHE
        });
        this.n2DeltaMultiplier = 1 - Math.pow(2, -(1 / (n2HalfLife * 60)));
        this.heDeltaMultiplier = 1 - Math.pow(2, -(1 / (heHalfLife * 60)));
    }
    ENVIRONMENT_PN2;
    ENVIRONMENT_PHE;
    MAX_NDL;
    calculateForSegment(segment) {
        for(let t = segment.StartTimestamp; t <= segment.EndTimestamp; t++){
            const prevN2 = this.getTissueByTime(t - 1).PN2;
            const gasN2 = segment.Gas.getPN2(segment.getDepth(t));
            const n2Delta = this.getPN2Delta(prevN2, gasN2);
            const prevHe = this.getTissueByTime(t - 1).PHe;
            const gasHe = segment.Gas.getPHe(segment.getDepth(t));
            const heDelta = this.getPHeDelta(prevHe, gasHe);
            this.tissueByTime.set(t, {
                PN2: prevN2 + n2Delta,
                PHe: prevHe + heDelta
            });
        }
    }
    discardAfterTime(time) {
        this.tissueByTime = new Map(Array.from(this.tissueByTime.entries()).filter(([key])=>key <= time));
    }
    clone() {
        const clone = new Tissue(this.tissueNumber, this.n2HalfLife, this.a_n2, this.b_n2, this.heHalfLife, this.a_he, this.b_he);
        clone.tissueByTime = new Map(this.tissueByTime);
        return clone;
    }
    getInstantCeiling(time) {
        const result = (this.getMValue(time) - 1) * 10;
        return result < 0 ? 0 : result;
    }
    getTimeToInstantCeiling(depth, gas) {
        const ceiling = this.getInstantCeiling(this.tissueByTime.size - 1);
        if (ceiling > 0) {
            return 0;
        }
        const minCeiling = this.getInstantCeilingByPressures(gas.getPN2(depth), gas.getPHe(depth));
        if (minCeiling === 0 || isNaN(minCeiling)) {
            return undefined;
        }
        const pN2 = this.getPN2(this.tissueByTime.size - 1);
        const pHe = this.getPHe(this.tissueByTime.size - 1);
        let minNDL = 0;
        let maxNDL = this.MAX_NDL;
        let time = (maxNDL - minNDL) / 2;
        while(minNDL < maxNDL){
            const newPN2 = pN2 + this.getPN2DeltaByTime(pN2, gas.getPN2(depth), time);
            const newPHe = pHe + this.getPHeDeltaByTime(pHe, gas.getPHe(depth), time);
            const newCeiling = this.getInstantCeilingByPressures(newPN2, newPHe);
            if (newCeiling <= 0) {
                minNDL = time;
            } else {
                maxNDL = time - 1;
            }
            time = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utility$2f$utility$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ceilingWithThreshold"])((maxNDL - minNDL) / 2) + minNDL;
        }
        if (time >= this.MAX_NDL) {
            return undefined;
        }
        return Math.floor(time);
    }
    getPN2(time) {
        return this.getTissueByTime(time).PN2;
    }
    getPHe(time) {
        return this.getTissueByTime(time).PHe;
    }
    getInstantCeilingByPressures(pN2, pHe) {
        const result = (this.getMValueByPressures(pN2, pHe) - 1) * 10;
        return result < 0 ? 0 : result;
    }
    getTissueByTime(time) {
        return this.tissueByTime.get(time) ?? {
            PN2: 0,
            PHe: 0
        };
    }
    getPN2Delta(tissuePN2, gasPN2) {
        return this.getTissueDelta(tissuePN2, gasPN2, this.n2DeltaMultiplier);
    }
    getPN2DeltaByTime(tissuePN2, gasPN2, time) {
        return this.getTissueDeltaByTime(tissuePN2, gasPN2, this.n2HalfLife, time);
    }
    getPHeDelta(tissuePHe, gasPHe) {
        return this.getTissueDelta(tissuePHe, gasPHe, this.heDeltaMultiplier);
    }
    getPHeDeltaByTime(tissuePHe, gasPHe, time) {
        return this.getTissueDeltaByTime(tissuePHe, gasPHe, this.heHalfLife, time);
    }
    getTissueDelta(tissuePartialPressure, gasPartialPressure, deltaMultiplier) {
        return (gasPartialPressure - tissuePartialPressure) * deltaMultiplier;
    }
    getTissueDeltaByTime(tissuePartialPressure, gasPartialPressure, halflife, time) {
        return (gasPartialPressure - tissuePartialPressure) * (1 - Math.pow(2, -(time / (halflife * 60))));
    }
    getAByPressures(pN2, pHe) {
        return (pN2 * this.a_n2 + pHe * this.a_he) / (pN2 + pHe);
    }
    getBByPressures(pN2, pHe) {
        return (pN2 * this.b_n2 + pHe * this.b_he) / (pN2 + pHe);
    }
    getMValue(time) {
        return this.getMValueByPressures(this.getPN2(time), this.getPHe(time));
    }
    getMValueByPressures(pN2, pHe) {
        return (pN2 + pHe - this.getAByPressures(pN2, pHe)) * this.getBByPressures(pN2, pHe);
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/dive-planner-service/BuhlmannZHL16C.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BuhlmannZHL16C",
    ()=>BuhlmannZHL16C
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$dive$2d$planner$2d$service$2f$Tissue$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/dive-planner-service/Tissue.ts [app-client] (ecmascript)");
;
class BuhlmannZHL16C {
    tissues = [];
    constructor(){
        this.tissues.push(new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$dive$2d$planner$2d$service$2f$Tissue$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tissue"](1, 5, 1.1696, 0.5578, 1.51, 1.7474, 0.4245));
        this.tissues.push(new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$dive$2d$planner$2d$service$2f$Tissue$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tissue"](2, 8, 1.0, 0.6514, 3.02, 1.383, 0.5747));
        this.tissues.push(new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$dive$2d$planner$2d$service$2f$Tissue$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tissue"](3, 12.5, 0.8618, 0.7222, 4.72, 1.1919, 0.6257));
        this.tissues.push(new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$dive$2d$planner$2d$service$2f$Tissue$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tissue"](4, 18.5, 0.7562, 0.7825, 6.99, 1.0458, 0.7223));
        this.tissues.push(new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$dive$2d$planner$2d$service$2f$Tissue$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tissue"](5, 27, 0.62, 0.8126, 10.21, 0.922, 0.7582));
        this.tissues.push(new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$dive$2d$planner$2d$service$2f$Tissue$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tissue"](6, 38.3, 0.5043, 0.8434, 14.48, 0.8205, 0.7957));
        this.tissues.push(new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$dive$2d$planner$2d$service$2f$Tissue$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tissue"](7, 54.3, 0.441, 0.8693, 20.53, 0.7305, 0.8279));
        this.tissues.push(new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$dive$2d$planner$2d$service$2f$Tissue$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tissue"](8, 77, 0.4, 0.891, 29.11, 0.6502, 0.8553));
        this.tissues.push(new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$dive$2d$planner$2d$service$2f$Tissue$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tissue"](9, 109, 0.375, 0.9092, 41.2, 0.595, 0.8757));
        this.tissues.push(new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$dive$2d$planner$2d$service$2f$Tissue$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tissue"](10, 146, 0.35, 0.9222, 55.19, 0.5545, 0.8903));
        this.tissues.push(new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$dive$2d$planner$2d$service$2f$Tissue$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tissue"](11, 187, 0.3295, 0.9319, 70.69, 0.5333, 0.8997));
        this.tissues.push(new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$dive$2d$planner$2d$service$2f$Tissue$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tissue"](12, 239, 0.3065, 0.9403, 90.34, 0.5189, 0.9073));
        this.tissues.push(new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$dive$2d$planner$2d$service$2f$Tissue$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tissue"](13, 305, 0.2835, 0.9477, 115.29, 0.5181, 0.9122));
        this.tissues.push(new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$dive$2d$planner$2d$service$2f$Tissue$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tissue"](14, 390, 0.261, 0.9544, 147.42, 0.5176, 0.9171));
        this.tissues.push(new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$dive$2d$planner$2d$service$2f$Tissue$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tissue"](15, 498, 0.248, 0.9602, 188.24, 0.5172, 0.9217));
        this.tissues.push(new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$dive$2d$planner$2d$service$2f$Tissue$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tissue"](16, 635, 0.2327, 0.9653, 240.03, 0.5119, 0.9267));
    }
    clone() {
        const result = new BuhlmannZHL16C();
        result.tissues = this.tissues.map((t)=>t.clone());
        return result;
    }
    discardAfterTime(time) {
        this.tissues.forEach((t)=>t.discardAfterTime(time));
    }
    calculateForSegment(segment) {
        this.tissues.forEach((t)=>t.calculateForSegment(segment));
    }
    getInstantCeiling(time) {
        return Math.max(...this.tissues.map((t)=>t.getInstantCeiling(time)));
    }
    getTimeToInstantCeiling(depth, gas) {
        const tissueNdls = this.tissues.map((t)=>t.getTimeToInstantCeiling(depth, gas));
        const validNdls = tissueNdls.filter((x)=>x !== undefined);
        if (validNdls.length === 0) return undefined;
        return Math.min(...validNdls);
    }
    getTissueInstantCeiling(time, tissue) {
        return this.tissues[tissue - 1].getInstantCeiling(time);
    }
    getTissuePN2(time, tissue) {
        return this.tissues[tissue - 1].getPN2(time);
    }
    getTissuePHe(time, tissue) {
        return this.tissues[tissue - 1].getPHe(time);
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/dive-planner-service/DiveProfile.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DiveProfile",
    ()=>DiveProfile
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utility$2f$utility$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/utility/utility.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$dive$2d$planner$2d$service$2f$BuhlmannZHL16C$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/dive-planner-service/BuhlmannZHL16C.ts [app-client] (ecmascript)");
;
;
class DiveProfile {
    diveSettings;
    diveSegmentFactory;
    segments;
    algo;
    MAX_NDL;
    constructor(diveSettings, diveSegmentFactory){
        this.diveSettings = diveSettings;
        this.diveSegmentFactory = diveSegmentFactory;
        this.segments = [];
        this.algo = new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$dive$2d$planner$2d$service$2f$BuhlmannZHL16C$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BuhlmannZHL16C"]();
        this.MAX_NDL = 3600 * 5;
    }
    addDiveSegment(newDepth, newGas, timeAtDepth) {
        this.removeLastSegment();
        const previousSegment = this.getLastSegment();
        let startTime = previousSegment.EndTimestamp;
        if (newDepth !== previousSegment.EndDepth) {
            this.addSegment(this.diveSegmentFactory.createDepthChangeSegment(startTime, previousSegment.EndDepth, newDepth, previousSegment.Gas));
            startTime = this.getTotalTime();
        }
        if (!previousSegment.Gas.isEquivalent(newGas)) {
            this.addSegment(this.diveSegmentFactory.createGasChangeSegment(startTime, newGas, newDepth));
        }
        if (timeAtDepth > 0) {
            this.addSegment(this.diveSegmentFactory.createMaintainDepthSegment(startTime, newDepth, timeAtDepth, newGas));
            startTime = this.getTotalTime();
        }
        this.addSegment(this.diveSegmentFactory.createEndDiveSegment(startTime, newDepth, newGas));
    }
    addChangeDepthSegment(newDepth) {
        this.removeLastSegment();
        const previousSegment = this.getLastSegment();
        this.addSegment(this.diveSegmentFactory.createDepthChangeSegment(previousSegment.EndTimestamp, previousSegment.EndDepth, newDepth, previousSegment.Gas));
        this.addSegment(this.diveSegmentFactory.createEndDiveSegment(this.getTotalTime(), newDepth, previousSegment.Gas));
    }
    addChangeGasSegment(newGas) {
        this.removeLastSegment();
        const previousSegment = this.getLastSegment();
        this.addSegment(this.diveSegmentFactory.createGasChangeSegment(previousSegment.EndTimestamp, newGas, previousSegment.EndDepth));
        this.addSegment(this.diveSegmentFactory.createEndDiveSegment(this.getTotalTime(), previousSegment.EndDepth, newGas));
    }
    addMaintainDepthSegment(timeAtDepth) {
        this.removeLastSegment();
        const previousSegment = this.getLastSegment();
        this.addSegment(this.diveSegmentFactory.createMaintainDepthSegment(previousSegment.EndTimestamp, previousSegment.EndDepth, timeAtDepth, previousSegment.Gas));
        this.addSegment(this.diveSegmentFactory.createEndDiveSegment(this.getTotalTime(), previousSegment.EndDepth, previousSegment.Gas));
    }
    getCurrentDepth() {
        return this.getPreviousSegment().EndDepth;
    }
    getTravelTime(newDepth) {
        return this.diveSegmentFactory.getTravelTime(this.getCurrentDepth(), newDepth);
    }
    startDive(startGas) {
        this.addSegment(this.diveSegmentFactory.createStartDiveSegment(startGas));
        this.addSegment(this.diveSegmentFactory.createEndDiveSegment(0, 0, startGas));
    }
    getCurrentGas() {
        return this.getPreviousSegment().Gas;
    }
    getCurrentDiveTime() {
        return this.getPreviousSegment().EndTimestamp;
    }
    getCurrentInstantCeiling() {
        const currentTime = this.getPreviousSegment().EndTimestamp;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utility$2f$utility$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ceilingWithThreshold"])(this.algo.getInstantCeiling(currentTime));
    }
    getCurrentCeiling() {
        const instantCeiling = this.getCurrentInstantCeiling();
        if (this.getCurrentDepth() <= instantCeiling) {
            return instantCeiling;
        }
        for(let t = this.getPreviousSegment().EndTimestamp; t <= this.getTotalTime(); t++){
            const ceiling = this.algo.getInstantCeiling(t);
            const depth = this.getDepth(t);
            if (depth < ceiling) {
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utility$2f$utility$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ceilingWithThreshold"])(this.getDepth(t - 1));
            }
        }
        return 0;
    }
    getNewCeiling(newDepth, timeAtDepth) {
        const wipProfile = this.getWipProfile(newDepth, this.getPreviousSegment().Gas, timeAtDepth);
        wipProfile.addSegment(this.diveSegmentFactory.createEndDiveSegment(wipProfile.getTotalTime(), newDepth, wipProfile.getLastSegment().Gas));
        return wipProfile.getCurrentCeiling();
    }
    getNewInstantCeiling(newDepth, timeAtDepth) {
        const wipProfile = this.getWipProfile(newDepth, this.getPreviousSegment().Gas, timeAtDepth);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utility$2f$utility$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ceilingWithThreshold"])(wipProfile.algo.getInstantCeiling(wipProfile.getTotalTime()));
    }
    getNoDecoLimit(newDepth, newGas, timeAtDepth) {
        const wipProfile = this.getWipProfile(newDepth, newGas, timeAtDepth);
        const ndl = wipProfile.algo.getTimeToInstantCeiling(newDepth, newGas);
        if (ndl === undefined) {
            return undefined;
        }
        wipProfile.addSegment(this.diveSegmentFactory.createMaintainDepthSegment(wipProfile.getTotalTime(), newDepth, ndl, newGas));
        let minTime = 0;
        let maxTime = 200;
        if (!wipProfile.canSurfaceWithoutStops()) {
            minTime = -ndl;
        }
        wipProfile.extendLastSegment(maxTime);
        while(wipProfile.canSurfaceWithoutStops() && maxTime <= this.MAX_NDL){
            minTime = maxTime;
            wipProfile.extendLastSegment(maxTime);
            maxTime *= 2;
        }
        if (maxTime > this.MAX_NDL) {
            return undefined;
        }
        maxTime--;
        let time = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utility$2f$utility$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ceilingWithThreshold"])((maxTime - minTime) / 2) + minTime;
        wipProfile.shortenLastSegment(maxTime + 1 - time);
        while(minTime < maxTime){
            if (wipProfile.canSurfaceWithoutStops()) {
                minTime = time;
                time = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utility$2f$utility$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ceilingWithThreshold"])((maxTime - minTime) / 2) + minTime;
                wipProfile.extendLastSegment(time - minTime);
            } else {
                maxTime = time - 1;
                time = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utility$2f$utility$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ceilingWithThreshold"])((maxTime - minTime) / 2) + minTime;
                wipProfile.shortenLastSegment(maxTime + 1 - time);
            }
        }
        return ndl + minTime;
    }
    // TODO: memoize this and only recalculate on the new segment bits
    getCeilingError() {
        let amount = 0;
        let duration = 0;
        for(let t = 0; t < this.getTotalTime(); t++){
            const ceiling = this.algo.getInstantCeiling(t);
            const depth = this.getDepth(t);
            if (depth < ceiling) {
                amount = Math.max(amount, ceiling - depth);
                duration++;
            }
        }
        return {
            amount,
            duration
        };
    }
    getPO2Error() {
        let maxPO2 = 0;
        let duration = 0;
        for(let t = 0; t < this.getTotalTime(); t++){
            const pO2 = this.getPO2(t);
            if (pO2 > this.diveSettings.decoPO2Maximum) {
                maxPO2 = Math.max(maxPO2, pO2);
                duration++;
            }
        }
        return {
            maxPO2,
            duration
        };
    }
    getHypoxicError() {
        let minPO2 = 999;
        let duration = 0;
        for(let t = 0; t < this.getTotalTime(); t++){
            const pO2 = this.getPO2(t);
            if (pO2 < this.diveSettings.pO2Minimum) {
                minPO2 = Math.min(minPO2, pO2);
                duration++;
            }
        }
        return {
            minPO2,
            duration
        };
    }
    getENDError() {
        let maxEND = 0;
        let duration = 0;
        for(let t = 0; t < this.getTotalTime(); t++){
            const end = this.getEND(t);
            if (end > this.diveSettings.ENDErrorThreshold) {
                maxEND = Math.max(end, maxEND);
                duration++;
            }
        }
        return {
            end: maxEND,
            duration
        };
    }
    getMaxDepth() {
        return Math.max(...this.segments.map((x)=>x.EndDepth));
    }
    getAverageDepth() {
        if (this.getTotalTime() === 0) return 0;
        return this.segments.reduce((sum, current)=>sum + current.getAverageDepth() * current.getDuration(), 0) / this.getTotalTime();
    }
    getTotalTime() {
        if (this.segments.length === 0) return 0;
        return this.getLastSegment().EndTimestamp;
    }
    addSegment(segment) {
        this.segments.push(segment);
        this.algo.calculateForSegment(segment);
    }
    getLastSegment() {
        return this.segments[this.segments.length - 1];
    }
    getCurrentProfile() {
        const result = this.clone();
        result.removeLastSegment();
        return result;
    }
    getPO2(time) {
        return this.getGas(time).getPO2(this.getDepth(time));
    }
    getPN2(time) {
        return this.getGas(time).getPN2(this.getDepth(time));
    }
    getPHe(time) {
        return this.getGas(time).getPHe(this.getDepth(time));
    }
    removeLastSegment() {
        this.segments.pop();
        this.algo.discardAfterTime(this.getTotalTime());
    }
    extendLastSegment(time) {
        this.getLastSegment().EndTimestamp += time;
        // TODO: can improve perf by not recalculating whole segment, just the last bit of time
        this.algo.calculateForSegment(this.getLastSegment());
    }
    shortenLastSegment(time) {
        this.getLastSegment().EndTimestamp -= time;
        // TODO: can improve perf by not recalculating whole segment, just throwing away some of the values instead
        this.algo.calculateForSegment(this.getLastSegment());
    }
    clone() {
        const result = new DiveProfile(this.diveSettings, this.diveSegmentFactory);
        result.algo = this.algo.clone();
        result.segments = this.segments.map((x)=>x.clone());
        return result;
    }
    getPreviousSegment() {
        return this.segments[this.segments.length - 2];
    }
    canSurfaceWithoutStops() {
        this.addSegment(this.diveSegmentFactory.createEndDiveSegment(this.getLastSegment().EndTimestamp, this.getLastSegment().EndDepth, this.getLastSegment().Gas));
        const result = this.getCeilingError().duration === 0;
        this.removeLastSegment();
        return result;
    }
    getSegment(time) {
        return this.segments.find((x)=>x.EndTimestamp > time && x.StartTimestamp <= time) ?? this.getLastSegment();
    }
    getGas(time) {
        return this.getSegment(time).Gas;
    }
    getDepth(time) {
        return this.getSegment(time).getDepth(time);
    }
    getEND(time) {
        if (this.diveSettings.isOxygenNarcotic) {
            return (this.getPN2(time) + this.getPO2(time) - 1) * 10;
        }
        return (this.getPN2(time) / 0.79 - 1) * 10;
    }
    getWipProfile(newDepth, newGas, timeAtDepth) {
        const wipProfile = this.getCurrentProfile();
        let depth = wipProfile.getLastSegment().EndDepth;
        let gas = wipProfile.getLastSegment().Gas;
        if (newDepth !== depth) {
            wipProfile.addSegment(this.diveSegmentFactory.createDepthChangeSegment(wipProfile.getTotalTime(), depth, newDepth, gas));
            depth = newDepth;
        }
        if (newGas !== gas) {
            wipProfile.addSegment(this.diveSegmentFactory.createGasChangeSegment(wipProfile.getTotalTime(), newGas, newDepth));
            gas = newGas;
        }
        if (timeAtDepth > 0) {
            wipProfile.addSegment(this.diveSegmentFactory.createMaintainDepthSegment(wipProfile.getTotalTime(), newDepth, timeAtDepth, newGas));
        }
        return wipProfile;
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/dive-planner-service/ChartGenerator.service.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ChartGeneratorService",
    ()=>ChartGeneratorService
]);
class ChartGeneratorService {
    diveSegmentFactory;
    diveSettings;
    constructor(diveSegmentFactory, diveSettings){
        this.diveSegmentFactory = diveSegmentFactory;
        this.diveSettings = diveSettings;
    }
    getDepthChartData(diveProfile) {
        const data = [];
        for (const segment of diveProfile.segments){
            for(let time = segment.StartTimestamp; time <= segment.EndTimestamp; time++){
                data.push({
                    time: time,
                    depth: segment.getDepth(time),
                    ceiling: 0
                });
            }
        }
        for (const d of data){
            d.ceiling = diveProfile.algo.getInstantCeiling(d.time);
        }
        return data;
    }
    getPO2ChartData(diveProfile) {
        const data = [];
        for (const segment of diveProfile.segments){
            for(let time = segment.StartTimestamp; time <= segment.EndTimestamp; time++){
                data.push({
                    time: time,
                    pO2: segment.Gas.getPO2(segment.getDepth(time)),
                    decoLimit: this.diveSettings.decoPO2Maximum,
                    limit: this.diveSettings.workingPO2Maximum,
                    min: this.diveSettings.pO2Minimum
                });
            }
        }
        return data;
    }
    getENDChartData(diveProfile) {
        const data = [];
        for (const segment of diveProfile.segments){
            for(let time = segment.StartTimestamp; time <= segment.EndTimestamp; time++){
                data.push({
                    time: time,
                    end: segment.Gas.getEND(segment.getDepth(time)),
                    errorLimit: this.diveSettings.ENDErrorThreshold
                });
            }
        }
        return data;
    }
    getTissuesCeilingChartData(diveProfile) {
        const data = [];
        for (const segment of diveProfile.segments){
            for(let time = segment.StartTimestamp; time <= segment.EndTimestamp; time++){
                const ceilings = [];
                for(let tissue = 1; tissue <= 16; tissue++){
                    ceilings.push(diveProfile.algo.getTissueInstantCeiling(time, tissue));
                }
                data.push({
                    time: time,
                    depth: segment.getDepth(time),
                    tissuesCeiling: ceilings
                });
            }
        }
        return data;
    }
    getTissuesPN2ChartData(diveProfile) {
        const data = [];
        for(let time = 0; time <= diveProfile.getTotalTime(); time++){
            const tissuesPN2 = [];
            for(let tissue = 1; tissue <= 16; tissue++){
                tissuesPN2.push(diveProfile.algo.getTissuePN2(time, tissue));
            }
            data.push({
                time: time,
                gasPN2: diveProfile.getPN2(time),
                tissuesPN2
            });
        }
        return data;
    }
    getTissuesPHeChartData(diveProfile) {
        const data = [];
        for(let time = 0; time <= diveProfile.getTotalTime(); time++){
            const tissuesPHe = [];
            for(let tissue = 1; tissue <= 16; tissue++){
                tissuesPHe.push(diveProfile.algo.getTissuePHe(time, tissue));
            }
            data.push({
                time: time,
                gasPHe: diveProfile.getPHe(time),
                tissuesPHe
            });
        }
        return data;
    }
    getCeilingChartData(newDepth, newGas, diveProfile) {
        const data = [];
        const wipProfile = diveProfile.getCurrentProfile();
        wipProfile.addSegment(this.diveSegmentFactory.createDepthChangeSegment(wipProfile.getTotalTime(), diveProfile.getCurrentDepth(), newDepth, diveProfile.getCurrentGas()));
        const startTime = wipProfile.getTotalTime();
        const chartDuration = 3600 * 2; // 2 hours
        wipProfile.addSegment(this.diveSegmentFactory.createMaintainDepthSegment(wipProfile.getTotalTime(), newDepth, chartDuration, newGas));
        for(let time = startTime; time < startTime + chartDuration; time++){
            data.push({
                time: time - startTime,
                ceiling: wipProfile.algo.getInstantCeiling(time)
            });
        }
        return data;
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/dive-planner-service/DivePlannerService.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DivePlannerService",
    ()=>DivePlannerService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$dive$2d$planner$2d$service$2f$BreathingGas$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/dive-planner-service/BreathingGas.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$dive$2d$planner$2d$service$2f$DiveSegmentFactory$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/dive-planner-service/DiveSegmentFactory.service.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$dive$2d$planner$2d$service$2f$DiveProfile$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/dive-planner-service/DiveProfile.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$dive$2d$planner$2d$service$2f$ChartGenerator$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/dive-planner-service/ChartGenerator.service.ts [app-client] (ecmascript)");
;
;
;
;
class DivePlannerService {
    settings;
    diveID;
    diveProfile;
    chartGenerator;
    diveSegmentFactory;
    constructor(settings){
        this.settings = settings;
        this.diveID = crypto.randomUUID();
        this.diveSegmentFactory = new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$dive$2d$planner$2d$service$2f$DiveSegmentFactory$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DiveSegmentFactoryService"](settings);
        this.chartGenerator = new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$dive$2d$planner$2d$service$2f$ChartGenerator$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ChartGeneratorService"](this.diveSegmentFactory, settings);
        this.diveProfile = new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$dive$2d$planner$2d$service$2f$DiveProfile$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DiveProfile"](settings, this.diveSegmentFactory);
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$dive$2d$planner$2d$service$2f$BreathingGas$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BreathingGas"].GenerateStandardGases(settings);
    }
    getStandardGases() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$dive$2d$planner$2d$service$2f$BreathingGas$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BreathingGas"].StandardGases;
    }
    startDive(startGas) {
        this.diveProfile = new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$dive$2d$planner$2d$service$2f$DiveProfile$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DiveProfile"](this.settings, this.diveSegmentFactory);
        this.diveProfile.startDive(startGas);
        this.diveID = crypto.randomUUID();
    }
    getDiveSegments() {
        return this.diveProfile.segments;
    }
    getDiveDuration() {
        return this.diveProfile.getTotalTime();
    }
    getMaxDepth() {
        return this.diveProfile.getMaxDepth();
    }
    getAverageDepth() {
        return this.diveProfile.getAverageDepth();
    }
    getCurrentDepth() {
        return this.diveProfile.getCurrentDepth();
    }
    getOptimalDecoGas(depth) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$dive$2d$planner$2d$service$2f$BreathingGas$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BreathingGas"].getOptimalDecoGas(depth, this.settings);
    }
    getCurrentCeiling() {
        return this.diveProfile.getCurrentCeiling();
    }
    getCurrentInstantCeiling() {
        return this.diveProfile.getCurrentInstantCeiling();
    }
    getCurrentGas() {
        return this.diveProfile.getCurrentGas();
    }
    getCurrentDiveTime() {
        return this.diveProfile.getCurrentDiveTime();
    }
    getNoDecoLimit(newDepth, newGas, timeAtDepth) {
        return this.diveProfile.getNoDecoLimit(newDepth, newGas, timeAtDepth);
    }
    addChangeDepthSegment(newDepth) {
        this.diveProfile.addChangeDepthSegment(newDepth);
    }
    addChangeGasSegment(newGas) {
        this.diveProfile.addChangeGasSegment(newGas);
    }
    addMaintainDepthSegment(timeAtDepth) {
        this.diveProfile.addMaintainDepthSegment(timeAtDepth);
    }
    getTravelTime(newDepth) {
        return this.diveProfile.getTravelTime(newDepth);
    }
    getDepthChartData() {
        return this.chartGenerator.getDepthChartData(this.diveProfile);
    }
    getPO2ChartData() {
        return this.chartGenerator.getPO2ChartData(this.diveProfile);
    }
    getENDChartData() {
        return this.chartGenerator.getENDChartData(this.diveProfile);
    }
    getTissuesCeilingChartData() {
        return this.chartGenerator.getTissuesCeilingChartData(this.diveProfile);
    }
    getTissuesPN2ChartData() {
        return this.chartGenerator.getTissuesPN2ChartData(this.diveProfile);
    }
    getTissuesPHeChartData() {
        return this.chartGenerator.getTissuesPHeChartData(this.diveProfile);
    }
    getCeilingChartData(newDepth, newGas) {
        return this.chartGenerator.getCeilingChartData(newDepth, newGas, this.diveProfile);
    }
    getNewCeiling(newDepth, timeAtDepth) {
        return this.diveProfile.getNewCeiling(newDepth, timeAtDepth);
    }
    getNewInstantCeiling(newDepth, timeAtDepth) {
        return this.diveProfile.getNewInstantCeiling(newDepth, timeAtDepth);
    }
    getCeilingError() {
        return this.diveProfile.getCeilingError();
    }
    getPO2Error() {
        return this.diveProfile.getPO2Error();
    }
    getHypoxicError() {
        return this.diveProfile.getHypoxicError();
    }
    getENDError() {
        return this.diveProfile.getENDError();
    }
    getPO2WarningMessage(pO2) {
        if (pO2 > this.settings.workingPO2Maximum && pO2 <= this.settings.decoPO2Maximum) return `Oxygen partial pressure should only go above ${this.settings.workingPO2Maximum} during deco stops`;
        return undefined;
    }
    getPO2ErrorMessage(pO2) {
        if (pO2 > this.settings.decoPO2Maximum) return `Oxygen partial pressure should never go above ${this.settings.decoPO2Maximum}`;
        if (pO2 < this.settings.pO2Minimum) return `Oxygen partial pressure should never go below ${this.settings.pO2Minimum}`;
        return undefined;
    }
    getENDErrorMessage(END) {
        if (END > this.settings.ENDErrorThreshold) return this.settings.ENDErrorMessage;
        return undefined;
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/dive-planner-service/DiveSettings.service.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DiveSettingsService",
    ()=>DiveSettingsService
]);
class DiveSettingsService {
    _ascentRate = 10;
    _descentRate = 20;
    _isOxygenNarcotic = true;
    _workingPO2Maximum = 1.4;
    _decoPO2Maximum = 1.6;
    _pO2Minimum = 0.18;
    _ENDErrorThreshold = 30;
    _subscribers = [];
    subscribeToChanges(callback) {
        this._subscribers.push(callback);
    }
    onSettingChange() {
        this._subscribers.forEach((x)=>x());
    }
    set ascentRate(rate) {
        this._ascentRate = rate;
        this.onSettingChange();
    }
    get ascentRate() {
        return this._ascentRate;
    }
    set descentRate(rate) {
        this._descentRate = rate;
        this.onSettingChange();
    }
    get descentRate() {
        return this._descentRate;
    }
    set isOxygenNarcotic(isNarcotic) {
        this._isOxygenNarcotic = isNarcotic;
        this.onSettingChange();
    }
    get isOxygenNarcotic() {
        return this._isOxygenNarcotic;
    }
    set workingPO2Maximum(threshold) {
        this._workingPO2Maximum = threshold;
        this.onSettingChange();
    }
    get workingPO2Maximum() {
        return this._workingPO2Maximum;
    }
    set decoPO2Maximum(threshold) {
        this._decoPO2Maximum = threshold;
        this.onSettingChange();
    }
    get decoPO2Maximum() {
        return this._decoPO2Maximum;
    }
    get pO2Minimum() {
        return this._pO2Minimum;
    }
    set pO2Minimum(value) {
        this._pO2Minimum = value;
        this.onSettingChange();
    }
    set ENDErrorThreshold(threshold) {
        this._ENDErrorThreshold = threshold;
        this.onSettingChange();
    }
    get ENDErrorThreshold() {
        return this._ENDErrorThreshold;
    }
    get ENDErrorMessage() {
        return `END is above the configured error threshold of ${this._ENDErrorThreshold}m`;
    }
    get MaxDepthPO2Tooltip() {
        return `Maximum depth this gas can be breathed at without going over an oxygen partial pressure of ${this.workingPO2Maximum} (${this.decoPO2Maximum} for deco stops)`;
    }
    get MaxDepthENDTooltip() {
        return `Maximum depth this gas can be breathed at before you experience narcosis equivalent to ${this._ENDErrorThreshold}m on air`;
    }
    get MinDepthTooltip() {
        return `Minimum depth this gas can be breathed at before you experience hypoxia (PO2 < ${this.pO2Minimum})`;
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/contexts/DivePlannerContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DivePlannerProvider",
    ()=>DivePlannerProvider,
    "useAddChangeDepthSegment",
    ()=>useAddChangeDepthSegment,
    "useAddChangeGasSegment",
    ()=>useAddChangeGasSegment,
    "useAddMaintainDepthSegment",
    ()=>useAddMaintainDepthSegment,
    "useDivePlanner",
    ()=>useDivePlanner,
    "useStartDive",
    ()=>useStartDive
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$dive$2d$planner$2d$service$2f$DivePlannerService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/dive-planner-service/DivePlannerService.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$dive$2d$planner$2d$service$2f$DiveSettings$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/dive-planner-service/DiveSettings.service.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature(), _s5 = __turbopack_context__.k.signature();
'use client';
;
;
;
const DivePlannerContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function DivePlannerProvider({ children }) {
    _s();
    const [updateTrigger, setUpdateTrigger] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const divePlanner = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "DivePlannerProvider.useMemo[divePlanner]": ()=>{
            const settings = new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$dive$2d$planner$2d$service$2f$DiveSettings$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DiveSettingsService"]();
            return new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$dive$2d$planner$2d$service$2f$DivePlannerService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DivePlannerService"](settings);
        }
    }["DivePlannerProvider.useMemo[divePlanner]"], []);
    const forceUpdate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "DivePlannerProvider.useCallback[forceUpdate]": ()=>{
            setUpdateTrigger({
                "DivePlannerProvider.useCallback[forceUpdate]": (prev)=>prev + 1
            }["DivePlannerProvider.useCallback[forceUpdate]"]);
        }
    }["DivePlannerProvider.useCallback[forceUpdate]"], []);
    const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "DivePlannerProvider.useMemo[value]": ()=>({
                divePlanner,
                updateTrigger,
                forceUpdate
            })
    }["DivePlannerProvider.useMemo[value]"], [
        divePlanner,
        updateTrigger,
        forceUpdate
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DivePlannerContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/app/contexts/DivePlannerContext.tsx",
        lineNumber: 35,
        columnNumber: 5
    }, this);
}
_s(DivePlannerProvider, "ZqA5IoEyV6nSAjR7Qtg0KeZG+nM=");
_c = DivePlannerProvider;
function useDivePlanner() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(DivePlannerContext);
    if (context === undefined) {
        throw new Error('useDivePlanner must be used within a DivePlannerProvider');
    }
    return context;
}
_s1(useDivePlanner, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
function useStartDive() {
    _s2();
    const { divePlanner, forceUpdate } = useDivePlanner();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useStartDive.useCallback": (startGas)=>{
            divePlanner.startDive(startGas);
            forceUpdate();
        }
    }["useStartDive.useCallback"], [
        divePlanner,
        forceUpdate
    ]);
}
_s2(useStartDive, "RE2D/PsZKLYPOL89H28iiN1jVLo=", false, function() {
    return [
        useDivePlanner
    ];
});
function useAddChangeDepthSegment() {
    _s3();
    const { divePlanner, forceUpdate } = useDivePlanner();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAddChangeDepthSegment.useCallback": (newDepth)=>{
            divePlanner.addChangeDepthSegment(newDepth);
            forceUpdate();
        }
    }["useAddChangeDepthSegment.useCallback"], [
        divePlanner,
        forceUpdate
    ]);
}
_s3(useAddChangeDepthSegment, "RE2D/PsZKLYPOL89H28iiN1jVLo=", false, function() {
    return [
        useDivePlanner
    ];
});
function useAddChangeGasSegment() {
    _s4();
    const { divePlanner, forceUpdate } = useDivePlanner();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAddChangeGasSegment.useCallback": (newGas)=>{
            divePlanner.addChangeGasSegment(newGas);
            forceUpdate();
        }
    }["useAddChangeGasSegment.useCallback"], [
        divePlanner,
        forceUpdate
    ]);
}
_s4(useAddChangeGasSegment, "RE2D/PsZKLYPOL89H28iiN1jVLo=", false, function() {
    return [
        useDivePlanner
    ];
});
function useAddMaintainDepthSegment() {
    _s5();
    const { divePlanner, forceUpdate } = useDivePlanner();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAddMaintainDepthSegment.useCallback": (timeAtDepth)=>{
            divePlanner.addMaintainDepthSegment(timeAtDepth);
            forceUpdate();
        }
    }["useAddMaintainDepthSegment.useCallback"], [
        divePlanner,
        forceUpdate
    ]);
}
_s5(useAddMaintainDepthSegment, "RE2D/PsZKLYPOL89H28iiN1jVLo=", false, function() {
    return [
        useDivePlanner
    ];
});
var _c;
__turbopack_context__.k.register(_c, "DivePlannerProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/theme.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$createTheme$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__createTheme$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/styles/createTheme.js [app-client] (ecmascript) <export default as createTheme>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$colors$2f$indigo$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__indigo$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/colors/indigo.js [app-client] (ecmascript) <export default as indigo>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$colors$2f$purple$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__purple$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/colors/purple.js [app-client] (ecmascript) <export default as purple>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$colors$2f$red$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__red$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/colors/red.js [app-client] (ecmascript) <export default as red>");
'use client';
;
;
const theme = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$createTheme$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__createTheme$3e$__["createTheme"])({
    palette: {
        primary: {
            main: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$colors$2f$indigo$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__indigo$3e$__["indigo"][500]
        },
        secondary: {
            main: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$colors$2f$purple$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__purple$3e$__["purple"]['A200']
        },
        error: {
            main: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$colors$2f$red$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__red$3e$__["red"][500]
        },
        warning: {
            main: '#FFC107'
        }
    },
    typography: {
        fontFamily: 'Roboto, "Helvetica Neue", sans-serif'
    }
});
const __TURBOPACK__default__export__ = theme;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/providers.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Providers
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$ThemeProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ThemeProvider$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/styles/ThemeProvider.js [app-client] (ecmascript) <export default as ThemeProvider>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$CssBaseline$2f$CssBaseline$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/CssBaseline/CssBaseline.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$contexts$2f$DivePlannerContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/contexts/DivePlannerContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$theme$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/theme.ts [app-client] (ecmascript)");
'use client';
;
;
;
;
;
function Providers({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$ThemeProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ThemeProvider$3e$__["ThemeProvider"], {
        theme: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$theme$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$CssBaseline$2f$CssBaseline$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/app/providers.tsx",
                lineNumber: 11,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$contexts$2f$DivePlannerContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DivePlannerProvider"], {
                children: children
            }, void 0, false, {
                fileName: "[project]/app/providers.tsx",
                lineNumber: 12,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/providers.tsx",
        lineNumber: 10,
        columnNumber: 5
    }, this);
}
_c = Providers;
var _c;
__turbopack_context__.k.register(_c, "Providers");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=app_930772e6._.js.map