const DOMINGO = 0;
const SEGUNDA = 1;
const TERCA = 2;
const QUARTA = 3;
const QUINTA = 4;
const SEXTA = 5;
const SABADO = 6;


module.exports = {

    parseSchedule (schedules, restaurantId){

        let scheduleValues = `(${schedules[0].day}, '${schedules[0].openTime}', '${schedules[0].closeTime}', ${restaurantId})`;

        for (let i = 0; i < schedules.length; i++) {
            if (i > 0) {
                scheduleValues += `, (${schedules[i].day}, '${schedules[i].openTime}', '${schedules[i].closeTime}', ${restaurantId})`;
            }
        }

        return scheduleValues;

    },

    handleSchedule (schedules){

        let s = [-1, -1, -1, -1, -1, -1, -1]; // Valores para saber se o dia está aberto ou não
        let weekDays = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
        let i = 0;
        schedules.forEach(schedule => {
            s[schedule.day - 1] = i
            i++
        })

        let scheduleStr = "";

        // verifica os horarios de segunda a sexta
        for (let i = SEGUNDA; i <= SEXTA; i++) {
            if (s[i] !== -1) {
                if (i != SEXTA) {
                    scheduleStr += `De ${weekDays[i]} à Sexta de ${schedules[s[i]].openTime} às ${schedules[s[i]].closeTime}. `
                }
                else {
                    scheduleStr += `${weekDays[i]}  de ${schedules[s[i]].openTime} às ${schedules[s[i]].closeTime}. `
                }
                break;
            }
        }

        // verifica os horarios do fim de semana

        if (schedules[s[DOMINGO]]?.openTime === schedules[s[SABADO]]?.openTime &&
            schedules[s[DOMINGO]]?.closeTime === schedules[s[SABADO]]?.closeTime) {

            scheduleStr += `Sábado e Domingo de ${schedules[s[DOMINGO]].openTime} às ${schedules[s[DOMINGO]].closeTime}.`

        } else {
            scheduleStr += `Sábado de ${schedules[s[SABADO]].openTime} às ${schedules[s[SABADO]].closeTime} `
            scheduleStr += `e Domingo de ${schedules[s[DOMINGO]].openTime} às ${schedules[s[DOMINGO]].closeTime}.`
        }

        return scheduleStr;
    }
}