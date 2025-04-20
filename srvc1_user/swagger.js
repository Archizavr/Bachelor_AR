import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "User Service API",
      version: "1.0.0",
      description: "API lietotāja pārvaldībai",
    },
    servers: [
      {
        url: "http://localhost:"+(process.env.PORT || 4001), // Jūsu bāzes URL
      },
    ],
  },
  apis: ["./modules/**/*.js"], // Ceļi uz Swagger komentāru failiem
};

const swaggerSpec = swaggerJsDoc(options);

export const swaggerDocs = (app, port) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log(`Swagger ir pieejams vietnē http://localhost:${port}/api-docs`);
};
