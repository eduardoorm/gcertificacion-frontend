import { APIData } from "../response";
import { CapacitacionSerie, DocumentacionSerie, InduccionSerie, ItemSerie } from "./series";

export interface AvanceInduccionState {
    induccionReports: APIData<InduccionSerie[]>;
}

export interface AvanceCapacitacionState {
    capacitacionReports: APIData<CapacitacionSerie[]>;
}

export interface AvanceDocumentacionState {
    documentacionReports: APIData<DocumentacionSerie[]>;
}

export const InitialPieOptions = {
    tooltip : {
      trigger: 'item',
      formatter: "{b} : {c} ({d}%)"
    },
    label: {
        color: '#333',
        fontSize: '.7rem',
        formatter: '{b}: {c} ({d}%)'
    },
    /*legend: {
        top: 'bottom',
        textStyle: {
            color: '#fff',
            fontSize: '1rem',
        }
    },*/
    series: [{
        name: 'Documentos',
        type: 'pie',
        radius: '65%',
        center: ['50%', '45%'],
        data: [
            /*{ value: 1048, name: 'Search Engine' },
            { value: 735, name: 'Direct' },*/
        ] as ItemSerie[],
        emphasis: {
            itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
        }
    }]
};
export const InitialBarOptions = {
    tooltip : {
        trigger: 'axis',
        axisPointer: {
            type: 'cross'
        },
        //formatter: "{b} : {c}%"
    },
    legend: {
        textStyle: {
            color: '#333',
            fontSize: '.8rem',
        }
    },
    label: {
        show: true,
        offset: [0, -35],
        color: '#333',
        fontSize: '.85rem',
        //formatter: '{c}%'
    },
    labelLine: {
        show: true
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        //data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        data: [] as string[],
        axisLabel: {
            color: '#333',
            fontSize: '.8rem',
        }
    },
    yAxis: {
        type: 'value',
        min: 0,
        max: 100,
        axisLabel: {
            color: '#333',
            fontSize: '.8rem',
            formatter: '{value} %',
        }
    },
    series: [{
        name: '',
        roundCap: false,
        //data: [120, 200, 150, 80, 70, 110, 130],
        data: [] as number[],
        type: 'bar',
        emphasis: {
            focus: 'series'
        },
    }]
}; 
export const InitialGaugeOptions = {
    toolbox: {
        show: true,
    },
    series: [{
        type: 'gauge',
        center: ['50%', '75%'],
        radius: '120%',
        startAngle: 180,
        endAngle: 0,
        min: 0,
        max: 100,
        splitNumber: 10,
        progress: {
            show: false,
            roundCap: true,
            itemStyle: {
                color: 'rgb(154, 96, 180)',
            }
        },
        pointer: {
            icon: 'path://M2090.36389,615.30999 L2090.36389,615.30999 C2091.48372,615.30999 2092.40383,616.194028 2092.44859,617.312956 L2096.90698,728.755929 C2097.05155,732.369577 2094.2393,735.416212 2090.62566,735.56078 C2090.53845,735.564269 2090.45117,735.566014 2090.36389,735.566014 L2090.36389,735.566014 C2086.74736,735.566014 2083.81557,732.63423 2083.81557,729.017692 C2083.81557,728.930412 2083.81732,728.84314 2083.82081,728.755929 L2088.2792,617.312956 C2088.32396,616.194028 2089.24407,615.30999 2090.36389,615.30999 Z',
            length: '90%',
            width: 8,
        },
        axisLine: {
            roundCap: false,
            lineStyle: {
                width: 30,
                color: [
                    [0.33, 'rgb(238, 102, 102)'],
                    [0.66, 'rgb(250, 200, 88)'],
                    [1, 'rgb(145, 204, 117)'],
                ],
                shadowColor: 'rgba(0, 0, 0, 0.5)',
                shadowBlur: 1,
            }
        },
        axisTick: {
            show: true,
            splitNumber: 2,
            lineStyle: {
                width: 2,
                color: '#333'
            }
        },
        splitLine: {
            length: 10,
            distance: 5,
            lineStyle: {
                width: 2,
                color: '#333'
            }
        },
        axisLabel: {
            show: true,
            distance: -30,
            color: '#333',
            fontSize: 12,
            formatter: function (value: number) {
                return value.toFixed(0);
            }
        },
        title: {
            show: false
        },
        detail: {
            offsetCenter: [0, '15%'],
            valueAnimation: true,
            formatter: function (value: number) {
                return '{value|' + value + '%}';
            },
            rich: {
                value: {
                    fontSize: 18,
                    color: '#333'
                },
            }
        },
        data: [{name: 'Inducción', value: 0}] as ItemSerie[],
    }]
};
export const InitialBarSerie = {
    name: '',
    roundCap: false,
    //data: [120, 200, 150, 80, 70, 110, 130],
    data: [] as number[],
    type: 'bar',
    emphasis: {
        focus: 'series'
    },
};
