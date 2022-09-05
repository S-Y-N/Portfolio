//long version for begginer $(document).ready(function())

//Функція прихобує блок імітації завантаження

$(function () {
    
    $("#loading").hide();
    $type = ['movie', 'series','episode'];
    $search = "";
     $("#loading1").hide();
    //елементу форми з полем для введення пошуку фільма навісили метод .keyup
    //як тільки клавіша відпускається і в полі мінімум 3 символа, запускається пошук фільму по введеному значенню в полі
    $('#search_field').on('keyup', function () {
        $search = $(this).val();
        //виклик функції
        search($search);
    });
    //на вибраний клас type додається обробник кліку і якщо елемент даного классу має позначку  checked ( радіо кнопки отримують це значення при виборі їх)
    //то присвоїти  поточне значення типу даному класу, по дефолту вибрана категорія ВСЕ     
    $(".type").click(function () {
        if ($(this).is(":checked")) {
            $type = $(this).val();

            search($search);
        }
    })

});
//функція пошуку фільму
//повертає на сторінку результат пошуку і переписує код сторінки
//метод .html("") використовує властивості innerHTML, прописується після першого знайденого блоку
//!можуть бути нюанси в IE
function search($search) {
     $("#loading1").hide();
    $("#movies").html("");
    //додаємо анімацію з плавним показом фільмів
    if ($search.length >= 3) {
        $("#loading").fadeIn();
        //затримка 3 секунди і показ результату на сторінці
        //якщо не знайшли - пуста сторінка
        setTimeout(function () {
            getMovies($search);
        }, 3000);
    } else {
          $("#loading1").show();
        $("#movies").html("");
    }
}

//для пошуку фільму використовується Axios js library, http-клієнт, для зручності написання коду і зручної роботи з json  
function getMovies(search) {

    if ($type == "all") $type = ['movie', 'series','episode'];

    axios.get('https://www.omdbapi.com', {
            params: {
                apikey: "78cc1a13",
                s: search,
                type: $type,
            }
        })
        .then((response) => {
            $movies = response.data.Search;
            $html = "";
            //динамічне створення сторінки з розміткой і модальними вікнами. Використання bootstrap 4 за рахунок простішою роботи з модальними вікнами. 
            $.each($movies, (index, movie) => {
                $html += `<div class="movie col-md-4">
                        <div class="card" data-toggle="modal"  data-target="#movieModal${ index }">
                            <p class="card-header">${ movie.Title }</p>
                            <div class="card-body">
                                <img src="${ movie.Poster }">
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal fade" id="movieModal${ index }" tabindex="-1" role="dialog" aria-labelledby="movieModal${index}Label" aria-hidden="true">
                        <div class="modal-dialog modal-sm" role="document">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="movieModal${ index }Label">${ movie.Title }</h5>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div class="modal-body">
                                    <table class="text-center table table-bordered">
                                        <tr>
                                            <th>Рік</th>
                                            <td>${ movie.Year }</td>
                                        </tr>
                                        <tr>
                                            <th>ID</th>
                                            <td>${movie.imdbID }</td>
                                        </tr>
                                        <tr>
                                            <th>Тип</th>
                                            <td>${ movie.Type }</td>
                                        </tr>
                                        
                                    </table>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-primary" data-dismiss="modal" class="cursor-pointer">Закрити</button>
                                </div>
                            </div>
                        </div>
                    </div>`;
            });

            $("#movies").html($html);
            $('.modal').modal('modal');
        });

    $("#loading").hide();
}