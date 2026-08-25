FROM python:3.12-slim AS builder

WORKDIR /fastapi

RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    # ^ headers needed to compile psycopg2 against PostgreSQL client lib
    && rm -rf /var/lib/apt/lists/*
    # clean apt cache in the SAME layer, or the image doesn't actually shrink

COPY requirements.txt .

RUN pip install --no-cache-dir --user -r requirements.txt

FROM python:3.12-slim

WORKDIR /fastapi

COPY --from=builder /root/.local /root/.local

COPY . .

ENV PATH=/root/.local/bin:$PATH

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]


