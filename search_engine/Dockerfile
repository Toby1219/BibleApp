FROM rust:1.96 AS builder

WORKDIR /search_engine

ENV CARGO_NET_RETRY=10
ENV CARGO_HTTP_TIMEOUT=60

COPY Cargo.toml Cargo.lock ./

RUN mkdir src && echo "fn main() {}" > src/main.rs

RUN cargo build --release --bin search_engine

COPY src ./src

RUN touch src/main.rs && cargo build --release --bin search_engine

FROM debian:bookworm-slim

WORKDIR /search_engine

COPY --from=builder /search_engine/target/release/search_engine ./search_engine

# COPY entrypoint.sh ./entrypoint.sh

# RUN chmod +x entrypoint.sh

EXPOSE 8000

CMD [ "./search_engine" ]