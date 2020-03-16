import React, { useState, useEffect, useRef, useMemo } from "react"
import serializeForm from "form-serialize"
import {
  BrowserRouter,
  Route,
  Routes,
  useNavigate,
  useLocation,
  Link
} from "react-router-dom"

function App() {
  let [persons, setPersons] = useState(4)
  let doFocusRef = useRef(false)
  let focusRef = useRef()
  let formRef = useRef()
  let navigate = useNavigate()

  useEffect(() => {
    if (doFocusRef.current === false) {
      doFocusRef.current = true
    } else {
      focusRef.current.focus()
    }
  }, [persons])

  function handleSubmit(event) {
    event.preventDefault()
    let values = serializeForm(event.target, { hash: true }).ages.filter(
      v => v !== "UNSET"
    )
    navigate(`infected/?ages=${values.map(v => v)}`)
  }

  return (
    <div id="App">
      <div className="prelude">
        <h1>Социальное дистанцирование</h1>
        <a href="https://corona-azure.now.sh" rel="noopener noreferrer" target="_blank">Original English version</a>
        <p>
          Многие люди очень скептически относятся к опасности Короновируса (covid-19).
          Я сделал этот сайт чтобы показать как твои действия могут повлиять на тебя,
          твою семью и общество вокруг.
          Все вычисления основаны на последних данных смертности на 14 марта 2020 года.
        </p>
      </div>
      <hr />
      <form id="HouseHoldForm" ref={formRef} onSubmit={handleSubmit}>
        {Array.from({ length: persons }).map((_, index, arr) => (
          <label
            key={index}
            ref={arr.length - 1 === index ? focusRef : undefined}
          >
            <span>
              {index === 0 ? "Твой возраст" : `Член семьи ${index}`}:
            </span>{" "}
            <AgeSelect defaultValue={index < 2 ? 40 : undefined} />
          </label>
        ))}
        <button type="button" onClick={() => setPersons(persons + 1)}>
          Добавить члена семьи
        </button>
        <button type="submit">Далее</button>
      </form>
    </div>
  )
}

function AgeSelect(props) {
  return (
    <select name="ages" {...props}>
      <option value="UNSET">- возраст</option>
      {Array.from({ length: 100 }).map((_, index) => (
        <option key={index}>{index}</option>
      ))}
    </select>
  )
}

////////////////////////////////////////////////////////////////////////////////
function Infection() {
  let location = useLocation()
  let navigate = useNavigate()
  let ages = parseAges(location.search)
  if (ages === null) {
    setTimeout(() => navigate("/"), [])
    return null
  }

  return (
    <div id="App">
      <div className="prelude">
        <h1>Допустим ты заражен</h1>
        <p>
          Давай кинем кубик и посмотрим, убьет ли вирус тебя или членов твоей семьи.
          Скорее всего нет.
        </p>
      </div>
      <div id="DiceRolls" className="center">
        {ages.map((age, index) => (
          <DiceRoll key={index} age={age} />
        ))}
      </div>
      <p>
        Как и ожидалось, скорее всего ты не умер. Но речь не о тебе. Давай посмотрим,
        как много людей убьет твоя семья, если вы не будете социально дистанцироваться от общества.
      </p>
      <Link className="big-link" to={`/killers${location.search}`}>
        Твой счетчик убийств ▸
      </Link>

      <hr />
      <h2>Больше информации</h2>
      <p>
        Если тебе менее 60 лет или если у тебя нет нарушений иммунитета
        <i> (что правда, для большинства твоих друзей или семьи)</i>, скорее всего тебе
        пришлось много раз нажимать на кнопку, чтобы выкинуть кубик со смертью.
      </p>
      <p>В таком случае это же как грипп, верно?</p>
      <p>
        На самом деле нет. Многие ссылаются, что количество смертей от гриппа гораздо выше (
        <a href="https://www.cdc.gov/flu/about/burden/index.html#:~:text=">
          12,000 to 61,000 в год в США
        </a>
        ), в противопоставлении малому кол-ву от Коронавируса (
        <a href="https://www.cnn.com/interactive/2020/health/coronavirus-maps-and-cases/">
          ~50 в США
        </a>
        ).
      </p>
      <p>
        Но, чтобы получить полную картину, необходимо проанализировать больше цифр.
        В нашем случае надо взглянуть на:
      </p>
      <ul>
        <li>Уровень смертности</li>
        <li>Темп роста инфекции</li>
      </ul>
      <p>
        Грипп имеет смертность 0.1%
        <br />
        Текущая смертность от Коронавируса (covid-19) 3.4%
      </p>
      <p>
        <b>
          <a href="https://www.sciencealert.com/covid-19-s-death-rate-is-higher-than-thought-but-it-should-drop">
            И это в 34 раза больше
          </a>
        </b>
        . Можно увидеть это визуально по красной шкале.
      </p>

      <div className="bars">
        <div className="bar covid">
          <span className="padding-adjust">COVID-19</span>
        </div>
        <div className="bar flu">
          <span className="padding-adjust">Influenza</span>
        </div>
      </div>
      <p>
        Легко увидеть насколько этот вирус страшнее даже без данных смертности.{" "}
        <b>Грипп не оказывает такую сильную нагрузку на систему здравоохранения{" "}
        </b>
        Италии каждый год, а{" "}
        <a href="https://www.theatlantic.com/ideas/archive/2020/03/who-gets-hospital-bed/607807/">
        вирус уже сделал это
        </a>
        .
      </p>
      <p>Но в России все еще ни одной смерти, верно? Чего беспокоиться?</p>
      <p>
        Большое беспокойство должна давать статистика смертности в 34 раза
        превышающая грипп и экспоненциальный рост распространения вируса.
      </p>
    </div>
  )
}

// https://www.worldometers.info/coronavirus/coronavirus-age-sex-demographics/
let rates = [
  [9, 0],
  [19, 0.002],
  [29, 0.002],
  [39, 0.002],
  [49, 0.004],
  [59, 0.013],
  [69, 0.036],
  [79, 0.08],
  [79, 0.148]
]

function DiceRoll({ age }) {
  let [state, setState] = useState("alive") // alive, dead, rolling
  let [rolls, setRolls] = useState(0)

  let rate = useMemo(() => {
    let rate
    for (let [maxAge, ageRate] of rates) {
      rate = ageRate
      if (age < maxAge) break
    }
    return rate
  }, [age])

  function rollDice() {
    setRolls(rolls + 1)
    setState("rolling")
  }

  useEffect(() => {
    if (state === "rolling") {
      let timer = setTimeout(() => {
        let rando = Math.random()
        if (rando <= rate) {
          setState("dead")
        } else {
          setState("alive")
        }
      }, 200)
      return () => {
        clearTimeout(timer)
      }
    }
  }, [state, rate])

  return (
    <div className="DiceRoll" data-state={state}>
      <div>
        <span aria-label={state} role="img">
          {state === "dead"
            ? "💀"
            : state === "alive"
            ? "😅"
            : state === "rolling"
            ? "🤮"
            : null}
        </span>{" "}
        <span>
          <b>{age} лет</b>
          <br />
          Смертность: {(rate * 100).toFixed(1)}%
        </span>
      </div>
      <div>
        <button disabled={state === "dead"} onClick={rollDice}>
          Кинуть кубик
        </button>{" "}
        <span>Бросков: {rolls}</span>
      </div>
    </div>
  )
}

////////////////////////////////////////////////////////////////////////////////
function KillCount({ ages }) {
  let [infected, setInfected] = useState(1)
  let [weeks, setWeeks] = useState(1)
  let rate = 0.034
  let Ro = 2

  let killed = Math.round(infected * rate)

  function nextWeek() {
    setInfected(infected * Ro)
    setWeeks(weeks + 1)
  }

  return (
    <div id="KillCount">
      <div aria-hidden="true">
        {Array.from({ length: killed }).map((_, index) => (
          // eslint-disable-next-line
          <span key={index}>💀</span>
        ))}
      </div>
      <p>Неделя: {weeks}</p>
      <p>Зараженные тобой люди: {infected}</p>
      <p>Убитые тобой люди: {killed}</p>
      <button onClick={nextWeek}>Прожить еще неделю</button>
    </div>
  )
}

function Killers() {
  let location = useLocation()
  let navigate = useNavigate()
  let ages = parseAges(location.search)
  if (ages === null) {
    setTimeout(() => navigate("/"), [])
    return null
  }

  return (
    <div id="App">
      <div className="prelude">
        <h1>Твой счетчик убийств</h1>
        <p>
          Социальное дистанцирование предотвратит количество людей которых ты можешь убить
          (я надеюсь это будет 0). На текущий момент инфицированный COVID-19 человек инфицирует еще двух.
        </p>
        <p>
          Ты заразил двух человек, на следующей неделе каждый из них заразил еще двух и так далее.
        </p>
        <p>Попробуй нажать кнопку несколько раз:</p>
      </div>
      <KillCount ages={ages} />
      <p>
        Так что, пожалуйста, оставайтесь дома. И пока ты там, можешь прочитать эту статью{" "}
        <a href="https://medium.com/@joschabach/flattening-the-curve-is-a-deadly-delusion-eea324fe9727">
        я думаю она стоит твоего времени (en)
        </a>
        . На данный момент, сдерживание вируса, это лучшее что мы можем сделать.
      </p>
      <hr />
      <h2>Больше информации</h2>
      <p>
        <Link to={`/infected${location.search}`}>
          На предыдущий странице мы взглянули на смертность
        </Link>{" "}
        от Короновируса COVID-19 и увидели, что статистически,
        ты и твоя семья скорее всего будут в порядке.
        Но социальное дистанцирование необходимо не для вас.
      </p>
      <p>
        Самое ужасное в этом вирусе, по сравнению с гриппом, то что ты можешь носить его
        в течении недель, заражая людей, и даже не будешь знать об этом.
        Нет способа выявить его, пока не будет поздно. Вот почему так важно дистанцирование.
      </p>
      <p>
        На калькуляторе выше ты увидел что логарифмический рост очень быстрый.
        Коронавирус следует практически идеальной логарифмической кривой.
      </p>
      <a
        style={{ display: "block", border: "solid 1px" }}
        href="https://www.worldometers.info/coronavirus/country/us/"
      >
        <img
          style={{ width: "100%" }}
          alt="graph showing a nearly perfect algorithmic growth rate"
          src="/graph.png"
        />
      </a>
      <p>

        <i>Скорость атаки</i> COVID-19 была приблизительно вычислена
        Всемирной Организацией Здоровья{" "}
        <a href="https://www.worldometers.info/coronavirus/#repro">
          между 1.4 и 2.5
        </a>
        .
        Это значит что если ты заболел, ты приблизительно заразишь двух других людей
        (другие исследования показывают это число около 4). Для сравнения грипп имеет 1.3
        и все что ниже 1 просто умирает само.
      </p>
    </div>
  )
}

function parseAges(search) {
  let params = new URLSearchParams(search)
  try {
    return params
      .get("ages")
      .split(",")
      .map(str => Number(str))
  } catch (e) {
    return null
  }
}

function AppRoot() {
  let location = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location])

  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/infected" element={<Infection />} />
      <Route path="/killers" element={<Killers />} />
    </Routes>
  )
}

export default () => (
  <BrowserRouter>
    <AppRoot />
  </BrowserRouter>
)
