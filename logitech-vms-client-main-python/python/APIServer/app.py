from calculation import *
import socketio
import os
from fastapi import FastAPI, Depends, Request, WebSocket, BackgroundTasks
from fastapi import Body, HTTPException, status
from fastapi.responses import Response, JSONResponse
from fastapi.encoders import jsonable_encoder
import strawberry
from strawberry.tools import create_type
from strawberry.fastapi import GraphQLRouter
from os import getenv

# override PyObjectId and Context scalars
# from .models import PyObjectId
# from .otypes import Context, PyObjectIdType

# # import all queries and mutations
# from .queries import queries
# from .mutations import mutations

app = FastAPI()
socket = socketio.Client(logger=False, engineio_logger=False)

socket.connect(f'ws://{os.getenv("SOCKETIO_HOST")}:{os.getenv("SOCKETIO_PORT")}')

# create query types
# Query = create_type("Query", queries)

# # create mutation types
# Mutation = create_type("Mutation", mutations)

# async def get_context() -> Context:
#     return Context()

# # schema = strawberry.Schema(query=Query, mutation=Mutation)
# schema = strawberry.federation.Schema(
#     query=Query,
#     mutation=Mutation,
#     enable_federation_2=True,
#     scalar_overrides={PyObjectId: PyObjectIdType},
# )

# # Get env variable of whether to run application in Debug Mode
# DEBUG = getenv("DEBUG", "false").lower() in ("true", "1", "t")

# graphql_app = GraphQLRouter(schema, context_getter=get_context )

# app.include_router(graphql_app, prefix="/graphql")

@socket.on('horizontalData')
def on_horizontalData(data: list[list[int | float]]):
    length, width, img = measureHorizontal(data, float(os.getenv('ACCURACY_STEP')), 
            float(os.getenv('X_RESOLUTION')),
            float(os.getenv('Y_RESOLUTION')),                           
            float(os.getenv('HORIZONTAL_OFFSET')),
            float(os.getenv('HORIZONTAL_OFFSET')))
    socket.emit("lengthData", length)
    socket.emit("widthData", width)
    socket.emit("imgData", img)
    return

@socket.on('verticalData')
def on_verticalData(data: list[int | float]):
    height = measureVertical(data, float(os.getenv('ACCURACY_STEP')), 
            float(os.getenv('Z_RESOLUTION')),
            float(os.getenv('VERTICAL_OFFSET')))
    socket.emit("heightData", height)
    return

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/liveness")
def liveness():
    return {}

@app.get("/readiness")
def readiness():
    return {}