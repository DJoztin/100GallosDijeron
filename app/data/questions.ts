import { Question } from "@/app/lib/types";

export const GAME_QUESTIONS: Question[] = [
  {
    id: "q1",
    text: "¿Qué es lo primero que haces al llegar a tu casa de la universidad?",
    answers: [
      { id: "q1-1", text: "Tirarme en la cama", points: 42, revealed: false },
      { id: "q1-2", text: "Comer algo", points: 28, revealed: false },
      { id: "q1-3", text: "Ver el celular", points: 16, revealed: false },
      { id: "q1-4", text: "Bañarme", points: 9, revealed: false },
      { id: "q1-5", text: "Quitarme los zapatos", points: 5, revealed: false },
    ],
  },
  {
    id: "q2",
    text: "¿Qué nunca puede faltar en el refri de un foráneo?",
    answers: [
      { id: "q2-1", text: "Sobras de comida", points: 35, revealed: false },
      { id: "q2-2", text: "Refresco / Agua", points: 25, revealed: false },
      { id: "q2-3", text: "Huevos", points: 20, revealed: false },
      { id: "q2-4", text: "Salsa", points: 12, revealed: false },
      { id: "q2-5", text: "Yogurt o fruta", points: 8, revealed: false },
    ],
  },
  {
    id: "q3",
    text: "¿Cuál es la excusa más común cuando llegas tarde a clases?",
    answers: [
      { id: "q3-1", text: "El tráfico / transporte", points: 40, revealed: false },
      { id: "q3-2", text: "Se me pegaron las cobijas", points: 30, revealed: false },
      { id: "q3-3", text: "No sonó el despertador", points: 18, revealed: false },
      { id: "q3-4", text: "Tuve un problema", points: 8, revealed: false },
      { id: "q3-5", text: "No encontré estacionamiento", points: 4, revealed: false },
    ],
  },
  {
    id: "q4",
    text: "¿Cuáles son las carreras menos populares de la uni?",
    answers: [
      { id: "q4-1", text: "Filosofía", points: 38, revealed: false },
      { id: "q4-2", text: "Física", points: 28, revealed: false },
      { id: "q4-3", text: "Latín / Humanidades", points: 18, revealed: false },
      { id: "q4-4", text: "Actuaría", points: 10, revealed: false },
      { id: "q4-5", text: "Ciencias del mar", points: 6, revealed: false },
    ],
  },
  {
    id: "q5",
    text: "¿Cuáles son las carreras más populares de la uni?",
    answers: [
      { id: "q5-1", text: "Administración", points: 34, revealed: false },
      { id: "q5-2", text: "Derecho", points: 28, revealed: false },
      { id: "q5-3", text: "Medicina", points: 20, revealed: false },
      { id: "q5-4", text: "Psicología", points: 12, revealed: false },
      { id: "q5-5", text: "Ingeniería", points: 6, revealed: false },
    ],
  },
  {
    id: "q6",
    text: "¿A dónde van a pistear después de la universidad?",
    answers: [
      { id: "q6-1", text: "Bar del barrio / zona de bares", points: 38, revealed: false },
      { id: "q6-2", text: "Casa de alguien", points: 30, revealed: false },
      { id: "q6-3", text: "Antro", points: 18, revealed: false },
      { id: "q6-4", text: "Parque o espacio abierto", points: 9, revealed: false },
      { id: "q6-5", text: "Donde se pueda", points: 5, revealed: false },
    ],
  },
  {
    id: "q7",
    text: "¿Cuáles son las formas más comunes de copiar en un examen?",
    answers: [
      { id: "q7-1", text: "Acordeón en papel", points: 36, revealed: false },
      { id: "q7-2", text: "Copiarle al de junto", points: 28, revealed: false },
      { id: "q7-3", text: "Acordeón en el celular", points: 20, revealed: false },
      { id: "q7-4", text: "Escribirse en la mano", points: 12, revealed: false },
      { id: "q7-5", text: "Señas con el compañero", points: 4, revealed: false },
    ],
  },
  {
    id: "q8",
    text: "¿Qué haces cuando se te va el internet?",
    answers: [
      { id: "q8-1", text: "Reinicio el router", points: 40, revealed: false },
      { id: "q8-2", text: "Me desespero y me quejo", points: 26, revealed: false },
      { id: "q8-3", text: "Uso datos del celular", points: 20, revealed: false },
      { id: "q8-4", text: "Llamo a la compañía", points: 9, revealed: false },
      { id: "q8-5", text: "Salgo a buscar señal", points: 5, revealed: false },
    ],
  },
  {
    id: "q9",
    text: "¿Qué es lo que más te molesta que un profesor haga?",
    answers: [
      { id: "q9-1", text: "Llegar tarde y no avisar", points: 35, revealed: false },
      { id: "q9-2", text: "Hablar muy monótono", points: 27, revealed: false },
      { id: "q9-3", text: "No explicar bien y culparte", points: 20, revealed: false },
      { id: "q9-4", text: "Poner tareas en fin de semana", points: 12, revealed: false },
      { id: "q9-5", text: "Pasar lista y luego irse", points: 6, revealed: false },
    ],
  },
  {
    id: "q10",
    text: "¿Cuáles son los lugares más populares de la universidad?",
    answers: [
      { id: "q10-1", text: "La cafetería", points: 38, revealed: false },
      { id: "q10-2", text: "La biblioteca", points: 27, revealed: false },
      { id: "q10-3", text: "Los pasillos / jardines", points: 18, revealed: false },
      { id: "q10-4", text: "La cancha", points: 11, revealed: false },
      { id: "q10-5", text: "La cooperativa / tiendita", points: 6, revealed: false },
    ],
  },
  {
    id: "q11",
    text: "¿Cuál es la comida más popular que encuentras en la uni?",
    answers: [
      { id: "q11-1", text: "Tacos", points: 40, revealed: false },
      { id: "q11-2", text: "Tortas", points: 25, revealed: false },
      { id: "q11-3", text: "Pizzas", points: 17, revealed: false },
      { id: "q11-4", text: "Tamales", points: 12, revealed: false },
      { id: "q11-5", text: "Sándwiches", points: 6, revealed: false },
    ],
  },
  {
    id: "q12",
    text: "¿Qué haces cuando no hiciste la tarea y el profe la va a revisar?",
    answers: [
      { id: "q12-1", text: "La hago en el camino / antes de clase", points: 38, revealed: false },
      { id: "q12-2", text: "Le copio a un compañero", points: 30, revealed: false },
      { id: "q12-3", text: "Digo que se me olvidó en casa", points: 18, revealed: false },
      { id: "q12-4", text: "Invento una excusa", points: 10, revealed: false },
      { id: "q12-5", text: "La entrego tarde y rezo", points: 4, revealed: false },
    ],
  },
  {
    id: "q13",
    text: "¿Cuál es la materia que más reprueba la gente?",
    answers: [
      { id: "q13-1", text: "Cálculo / Matemáticas", points: 45, revealed: false },
      { id: "q13-2", text: "Física", points: 28, revealed: false },
      { id: "q13-3", text: "Química", points: 16, revealed: false },
      { id: "q13-4", text: "Estadística", points: 8, revealed: false },
      { id: "q13-5", text: "Contabilidad", points: 3, revealed: false },
    ],
  },
  {
    id: "q14",
    text: "¿Qué llevas siempre en tu mochila aunque no lo uses?",
    answers: [
      { id: "q14-1", text: "Cuadernos de semestres pasados", points: 34, revealed: false },
      { id: "q14-2", text: "Cargador que nunca enchufas", points: 27, revealed: false },
      { id: "q14-3", text: "Libros que no abres", points: 20, revealed: false },
      { id: "q14-4", text: "Ropa extra", points: 12, revealed: false },
      { id: "q14-5", text: "Medicamentos caducos", points: 7, revealed: false },
    ],
  },
  {
    id: "q15",
    text: "¿Qué haces en una clase que no entiendes nada?",
    answers: [
      { id: "q15-1", text: "Finjo que entiendo y asiento", points: 42, revealed: false },
      { id: "q15-2", text: "Busco en Google en secreto", points: 28, revealed: false },
      { id: "q15-3", text: "Le pregunto a un compañero", points: 16, revealed: false },
      { id: "q15-4", text: "Me pongo a ver el celular", points: 10, revealed: false },
      { id: "q15-5", text: "Espero a que termine", points: 4, revealed: false },
    ],
  },
  {
    id: "q16",
    text: "¿Dónde sueles quedarte dormido/a en la universidad?",
    answers: [
      { id: "q16-1", text: "En clase", points: 45, revealed: false },
      { id: "q16-2", text: "En la biblioteca", points: 28, revealed: false },
      { id: "q16-3", text: "En los pasillos / jardines", points: 16, revealed: false },
      { id: "q16-4", text: "En la cafetería", points: 8, revealed: false },
      { id: "q16-5", text: "En el coche", points: 3, revealed: false },
    ],
  },
  {
    id: "q17",
    text: "¿Qué es lo primero que haces cuando sales de vacaciones?",
    answers: [
      { id: "q17-1", text: "Dormir hasta tarde", points: 44, revealed: false },
      { id: "q17-2", text: "Salir con amigos", points: 28, revealed: false },
      { id: "q17-3", text: "Ver series o películas", points: 16, revealed: false },
      { id: "q17-4", text: "Irme de viaje", points: 8, revealed: false },
      { id: "q17-5", text: "Comer todo lo que quiera", points: 4, revealed: false },
    ],
  },
];