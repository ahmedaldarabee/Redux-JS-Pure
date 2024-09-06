    <script>

        // redux provider steps
        // 1- create an action
        // 2- create reducer to handle the action
        // 3- create state manager by create store
        // 4- know you can track the result of your reducer through:
        //  getStatus + subscribe methods after you providing the dispatching method to you methods

        const withDraw = function(amount){
            return {
                type : "withdraw mony",
                payload : amount
            }
        };

        const deposit = function(amount){
            return {
                type : "deposit mony",
                payload : amount
            }
        };

        const Check = function(amount){
            return {
                type : "check mony",
                payload: amount
            }
        };
        
        const addProduct = function(newProduct){
            return {
                type : "add a product",
                payload : newProduct
            }
        }

        const getProduct = function(getProduct){
            return {
                type : "get the product",
                payload : getProduct
            }
        }

        // spacial case that used when you want to work with API
        const fitchData = function(){

            return async (dispatch) => {
                try {
                    const response = await fetch('https://fakestoreapi.com/products');
                    const data     = await response.json();
                    console.log("Fetched data: ", data);
                    dispatch(getProduct(data));
                
                }catch(error){
                    console.log('fetching api error: ' , error)
                }
            }
        }

        // building handler method
        const bankReducer = function(state = 1000 , action){
            switch(action.type){
                // the cased be as based on the type not based on the function name
                case "deposit mony":
                    // the state changes here called manipulating
                    return state + action.payload;
                case "withdraw mony":
                    return state - action.payload;
                default :
                    return state;
            }
        }

        const productReducer = function(state = [] , action){
            switch(action.type){
                case "get the product":
                    return [...action.payload]
                case "add a product":
                    return [...state,action.payload];
                default :
                    return state;
            }
        }

        // When you want to compost multi reducer in one state manager !
        const rootReducer = Redux.combineReducers({
            bank : bankReducer,
            products : productReducer
        })
        
        // building stateManager
        // Redux.applyMiddleware( ReduxThunk , another middleware helper between Components )
        // Middleware: that support component communication and information exchange

        const stateManager = Redux.createStore(rootReducer , Redux.applyMiddleware(ReduxThunk));
        

        function BankReducer() {
            console.log("The current state is: ", stateManager.getState(), '\n\n');

            stateManager.subscribe(() => {
                console.log("The result after handling: ", stateManager.getState());
            });

            const inputData = document.querySelector(".getData");
            const result = document.querySelector(".value");

            const withDrawBtn = document.querySelector(".withdraw");
            const depositBtn = document.querySelector(".deposit");

            withDrawBtn.addEventListener('click', () => {
                if (inputData.value !== '') {
                    stateManager.dispatch(withDraw(+(inputData.value)));
                    result.style.display = 'block';
                    result.innerHTML = "The value: " + stateManager.getState().bank;
                } else {
                    result.style.display = 'none';
                }
            });

            depositBtn.addEventListener('click', () => {
                if (inputData.value !== '') {
                    stateManager.dispatch(deposit(+(inputData.value)));
                    result.style.display = 'block';
                    result.innerHTML = "The value: " + stateManager.getState().bank;
                } else {
                    result.style.display = 'none';
                }
            });
        }

        BankReducer();


        function ProductReducer(){
            console.log("The current state of products before changes : " , stateManager.getState() )
            
            stateManager.subscribe(() => {
                console.log("The current state after changes : " , stateManager.getState() )
            })

            stateManager.dispatch(addProduct({
                    id:10 ,
                    name:"dell laptop core i5" , 
                    salary:500
                }
            ));

            stateManager.dispatch(addProduct({
                    id:20 ,
                    name:"dell laptop core i5" , 
                    salary:1500
                }
            ));

            stateManager.dispatch(addProduct({
                    id:30 ,
                    name:"dell laptop core i5" , 
                    salary:2000
                }
            ));
            
            stateManager.dispatch(fitchData());
        }

    </script> 
