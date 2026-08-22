#!/bin/bash
cd "$(dirname "$0")/backend"
source venv/bin/activate
uvicorn main:app --reload --port 8000