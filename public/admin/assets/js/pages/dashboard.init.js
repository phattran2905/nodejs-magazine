options = {
    chart: {
        height: 250,
        type: "radialBar",
        offsetY: -20
    },
    plotOptions: {
        radialBar: {
            startAngle: -135,
            endAngle: 135,
            hollow: {
                size: "72%"
            },
            dataLabels: {
                name: {
                    offsetY: -15
                },
                value: {
                    offsetY: 12,
                    fontSize: "18px",
                    color: void 0,
                    formatter: function (e) {
                        return e + "%"
                    }
                }
            }
        }
    },
    colors: ["#fb4d53"],
    fill: {
        type: "gradient",
        gradient: {
            shade: "dark",
            shadeIntensity: .15,
            inverseColors: !1,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 50, 65, 91]
        }
    },
    series: [95],
    labels: ["Year"]
};
(chart = new ApexCharts(document.querySelector("#earning-yearly-chart"), options)).render(), $("#usa").vectorMap({
    map: "usa_en",
    enableZoom: !0,
    showTooltip: !0,
    selectedColor: null,
    hoverColor: "#5b9ff9",
    backgroundColor: "transparent",
    color: "#3d8ef8",
    borderColor: "#bcbfc7",
    colors: {
        ca: "#5b9ff9",
        tx: "#5b9ff9",
        mt: "#5b9ff9",
        ny: "#5b9ff9"
    },
    onRegionClick: function (e, o, r) {
        e.preventDefault()
    }
});
var chart;
options = {
    chart: {
        height: 300,
        type: "radar",
        toolbar: {
            show: !1
        }
    },
    series: [{
        name: "Facebook",
        data: [80, 50, 45, 40, 100, 20]
    }, {
        name: "Twitter",
        data: [60, 65, 22, 89, 76, 75]
    }],
    markers: {
        size: 0
    },
    colors: ["#3d8ef8", "#11c46e"],
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
};
(chart = new ApexCharts(document.querySelector("#social-source-chart"), options)).render();