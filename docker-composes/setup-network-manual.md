# Cách thức setup multiple nodes

1. Tham khảo file cấu hình trong coordinator và peer-1 (tương tự nhau)

2. Một node tham gia network cần có các file như sau:
    - config.toml: File cấu hình network tendermint. `Mỗi node sẽ cấu hình riêng tuỳ vào node operator`
    - genesis.json: File cấu hình xác định node tham gia validate. `Tất cả các node khi setup cần dùng chung 1 file genesis.json`
    - node_key.json: File key node key của tendermint, dùng để node authenticate khi gửi message với nhau, tương ứng với node-id. `Mỗi node có 1 node_key.json riêng, k trùng nhau`
    - priv_validator.json: File public/private key của node, dùng để xác thực khi xác thực block lúc consensus. `Mỗi node có 1 priv_validator.json riêng, k trùng nhau`
    

2. Các bước cấu hình: VD: 3 nodes:
    1. Mỗi node cần tạo ra 1 cặp file `node_key.json` và `priv_validator.json`. (Lấy từ file mẫu đã generate sẵn: `docker-compose/node-keys` và `docker-compose/validator-keys`)
    
    2. Cấu hình file genesis.json: Update key `validators`, để khai báo pub_keys của các node (lấy từ file `priv_validator.json` của từng node. `name` đặt theo tên node, tuỳ ý)
    
        ```$json 
          "validators": [
            {
              "pub_key": {
                "type": "tendermint/PubKeyEd25519",
                "value": "/Jhlq8HPSM1TqQ6tr1YLG2Ro4S/iyNViMBkHLQJ11/U="
              },
              "power": "10",
              "name": "coordinator"
            },
            {
              "pub_key": {
                "type": "tendermint/PubKeyEd25519",
                "value": "wK9s7NwPsMpdZlXt/ogkf6zndUzc2XhTZyljV/D01xk="
              },
              "power": "10",
              "name": "peer-1"
            }
          ],

        ```

    3. Cấu hình file config.toml: Update key `persistent_peers` để khai báo các peer connect tới theo format sau: 
    ```$toml
    persistent_peers = "<Member 1 node id>@<Member 1 hostname>:26656,\
    <Member 2 node id>@<Member 2 hostname>:26656,\
    <Member N node id>@<Member N hostname>:26656,"
    ```
    Trong đó `node_id` lấy theo chuỗi id tương ứng với `node_key` (lấy tương ứng trong file `node-keys`, mỗi json có 1 chuỗi id ở phía trước)
    
    VD:
    ```$toml
    persistent_peers = "efb94838c9292e340514a35f60194f26f0498a37@tendermint-2:26656"
    ```
    
    4. Run docker-compose.yml up -d, docker-compose sẽ mount các file config vào tendermint container. Và khi start container, sẽ tự động copy các file config vào folder config của tendermint.
    
    5. Test: Gửi thử 1 giao dịch vào 1 trong các node, và check transaction tồn tại trên các node còn lại theo REST API
    
    6. Cấu hình tối ưu production: Mỗi service nên chạy trên 1 instance riêng: http://docs.bigchaindb.com/projects/server/en/latest/production-nodes/node-components.html
    