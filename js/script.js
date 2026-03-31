$(document).ready(function () {

    $("body").addClass("fade-in");

    $("a").on("click", function (e) {

        var link = $(this).attr("href");

        if (!link || link.startsWith("#") || link.startsWith("http")) {
            return;
        }

        if ($(this).closest(".program-card").length) {
            return;
        }

        e.preventDefault();

        $("body").removeClass("fade-in").addClass("fade-out");

        setTimeout(function () {
            window.location.href = link;
        }, 400);

    });

    // LOAD NAVBAR
    $("#navbar-container").load("components/navbar.html");

    // ✅ SCROLL LOGIC (FINAL FIXED)
    let lastScrollTop = 0;
    let delta = 5;

    $(window).on("scroll", function () {

        var scrollTop = $(window).scrollTop();
        var windowHeight = $(window).height();
        var docHeight = $(document).height();

        var scrollPercent = (scrollTop / (docHeight - windowHeight)) * 100;

        $("#scroll-progress").css("width", scrollPercent + "%");

        var circle = document.querySelector("#scrollTopBtn circle");

        if (circle) {

            var radius = circle.r.baseVal.value;
            var circumference = 2 * Math.PI * radius;

            circle.style.strokeDasharray = circumference;

            var offset = circumference - (scrollPercent / 100) * circumference;

            circle.style.strokeDashoffset = offset;

        }

        if (scrollTop > 300) {
            $("#scrollTopBtn").addClass("show");
        } else {
            $("#scrollTopBtn").removeClass("show");
        }

        $(".reveal").each(function () {

            var elementTop = $(this).offset().top;

            if (scrollTop + windowHeight > elementTop + 100) {
                $(this).addClass("active");
            } else {
                $(this).removeClass("active");
            }

        });

        $(".word-reveal").each(function () {

            var elementTop = $(this).offset().top;
            var elementBottom = elementTop + $(this).outerHeight();
            var viewportBottom = scrollTop + windowHeight;

            if (elementBottom > scrollTop && elementTop < viewportBottom) {

                $(this).find("span").each(function (i) {

                    var span = $(this);

                    setTimeout(function () {
                        span.addClass("show");
                    }, i * 150);

                });

            } else {
                $(this).find("span").removeClass("show");
            }

        });

        // ✅ FINAL FIX — GROUPED NAVBAR LOGIC
        if (Math.abs(scrollTop - lastScrollTop) > delta) {

            // HIDE / SHOW
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                $(".navbar-saas").addClass("navbar-hidden");
            } else {
                $(".navbar-saas").removeClass("navbar-hidden");
            }

            // STYLE CHANGE
            if (scrollTop > 50) {
                $(".navbar-saas").addClass("navbar-scrolled");
            } else {
                $(".navbar-saas").removeClass("navbar-scrolled");
            }

            lastScrollTop = scrollTop;
        }

    });

    function initWordReveal() {

        $(".word-reveal").each(function () {

            var text = $(this).text().trim();

            if (text.length > 0 && !$(this).find("span").length) {

                var words = text.split(" ");
                $(this).empty();

                for (let i = 0; i < words.length; i++) {
                    $(this).append("<span>" + words[i] + "</span>");
                }

            }

        });

    }

    initWordReveal();

    $("#programSearch").on("keyup", function () {

        let value = $(this).val().toLowerCase().trim();

        $(".program-item").each(function () {

            let text = $(this).text().toLowerCase();

            if (text.includes(value)) {
                $(this).fadeIn(200);
            } else {
                $(this).fadeOut(200);
            }

        });

    });

    $("#scrollTopBtn").click(function () {

        $("html, body").animate({
            scrollTop: 0
        }, 600);

    });

    $(".program-card").click(function () {

        var program = $(this).data("program");

        if (program) {

            $("body").removeClass("fade-in").addClass("fade-out");

            setTimeout(function () {
                window.location.href = "program-detail.html?program=" + program;
            }, 400);

        }

    });

    function getQueryParam(param) {
        var urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    var programName = getQueryParam("program");

    if (programName && typeof programData !== "undefined" && programData[programName]) {

        var data = programData[programName];

        $("#programTitle").text(data.title);
        $("#programSubtitle").text(data.subtitle);
        $("#programDuration").text(data.duration);
        $("#programLevel").text(data.level);
        $("#programCalories").text(data.calories);

        if (data.exercises && data.exercises.length > 0) {

            let listHTML = "";

            data.exercises.forEach((ex, index) => {
                listHTML += `
                    <button class="exercise-btn ${index === 0 ? 'active' : ''}" data-index="${index}">
                        ${ex.name}
                    </button>
                `;
            });

            $("#exerciseList").html(listHTML);

            let first = data.exercises[0];

            $("#exerciseTitle").text(first.name);
            $("#exerciseDesc").text(first.desc);
            $("#programGif").attr("src", first.image);

            $(".exercise-btn").click(function () {

                let i = $(this).data("index");
                let selected = data.exercises[i];

                $(".exercise-btn").removeClass("active");
                $(this).addClass("active");

                $("#exerciseTitle").text(selected.name);
                $("#exerciseDesc").text(selected.desc);
                $("#programGif").attr("src", selected.image);

            });

        }

    }

    $("#startWorkoutBtn").click(function () {

        var programName = new URLSearchParams(window.location.search).get("program");

        if (programName) {

            $("body").removeClass("fade-in").addClass("fade-out");

            setTimeout(function () {
                window.location.href = "workout.html?program=" + programName;
            }, 400);

        }

    });

    // IMAGE PREVIEW
$("#imageUpload").on("change", function (event) {

    let file = event.target.files[0];

    if (file) {
        let reader = new FileReader();

        reader.onload = function (e) {
            $("#previewImage").attr("src", e.target.result).show();
        };

        reader.readAsDataURL(file);
    }

});

// BMI + REVIEW LOGIC
$("#imageUpload").on("change", function (event) {

    let file = event.target.files[0];

    if (file) {
        let reader = new FileReader();

        reader.onload = function (e) {
            $("#previewImage").attr("src", e.target.result).fadeIn();
        };

        reader.readAsDataURL(file);
    }

});

$("#analyzeBtn").click(function () {

    let name = $("#name").val();
    let age = $("#age").val();
    let height = $("#height").val() / 100;
    let weight = $("#weight").val();

    if (!name || !age || !height || !weight) {
        alert("Please fill all fields");
        return;
    }

    $("#loadingBox").fadeIn();
    $("#resultBox").hide();

    setTimeout(function () {

        $("#loadingBox").fadeOut();

        let bmi = (weight / (height * height)).toFixed(1);

        let category = "";
        let advice = "";
        let workoutType = "";
        let program = "";
        let exercises = [];

        if (bmi < 18.5) {
            category = "Underweight";
            advice = "Focus on gaining strength and muscle mass.";
            workoutType = "Strength Training + High Calorie Diet";
            program = "Muscle Builder Program";
            exercises = ["Push-ups", "Squats", "Deadlifts"];
        } 
        else if (bmi < 25) {
            category = "Fit";
            advice = "Maintain your current fitness level.";
            workoutType = "Balanced Training (Strength + Cardio)";
            program = "Full Body Fitness";
            exercises = ["Plank", "Jump Rope", "Lunges"];
        } 
        else if (bmi < 30) {
            category = "Overweight";
            advice = "Focus on fat loss and cardio workouts.";
            workoutType = "Fat Burn + HIIT";
            program = "Fat Burn Program";
            exercises = ["Burpees", "Mountain Climbers", "Jump Squats"];
        } 
        else {
            category = "Obese";
            advice = "Start with light workouts and gradually increase intensity.";
            workoutType = "Light Cardio + Beginner Workouts";
            program = "Beginner Fat Loss";
            exercises = ["Walking", "Step-ups", "Light Cycling"];
        }

        $("#resultName").text("Hello " + name);

        // BMI animation
        let count = 0;
        let interval = setInterval(function () {
            count += 0.5;
            $("#bmiValue").text(count.toFixed(1));

            if (count >= bmi) {
                clearInterval(interval);
                $("#bmiValue").text(bmi);
            }
        }, 20);

        $("#bmiResult").text("BMI: " + bmi + " (" + category + ")");
        $("#fitnessAdvice").text(advice);

        // 🔥 WORKOUT PLAN
        $("#workoutType").text("Workout Type: " + workoutType);
        $("#workoutProgram").text("Recommended Program: " + program);

        let listHTML = "";
        exercises.forEach(ex => {
            listHTML += "<li>" + ex + "</li>";
        });

        $("#exerciseListPlan").html(listHTML);

        $("#resultBox").fadeIn();
        $("#workoutPlan").fadeIn();

    }, 2000);

});

$("#generateDiet").click(function () {

    let goal = $("#goalSelect").val();

    if (!goal) {
        alert("Please select a goal");
        return;
    }

    let title = "", calories = "", protein = "", carbs = "", fat = "";
    let breakfast = "", lunch = "", dinner = "";

    if (goal === "loss") {

        title = "🔥 Fat Loss Plan";
        calories = "Calories: 1600 kcal";
        protein = "Protein: 120g";
        carbs = "Carbs: 150g";
        fat = "Fat: 50g";

        breakfast = "Oats + Berries + Green Tea";
        lunch = "Grilled Chicken / Paneer + Salad + Brown Rice";
        dinner = "Vegetable Soup + Boiled Eggs";

    } 
    else if (goal === "gain") {

        title = "💪 Muscle Gain Plan";
        calories = "Calories: 2800 kcal";
        protein = "Protein: 160g";
        carbs = "Carbs: 300g";
        fat = "Fat: 80g";

        breakfast = "Eggs + Peanut Butter Toast + Milk";
        lunch = "Rice + Chicken / Dal + Veg + Curd";
        dinner = "Paneer + Chapati + Protein Shake";

    } 
    else {

        title = "⚖ Maintenance Plan";
        calories = "Calories: 2200 kcal";
        protein = "Protein: 100g";
        carbs = "Carbs: 220g";
        fat = "Fat: 70g";

        breakfast = "Poha / Oats + Fruits";
        lunch = "Balanced Meal (Rice + Dal + Veg)";
        dinner = "Light Meal + Salad";

    }

    $("#dietTitle").text(title);

    $("#caloriesText").text(calories);
    $("#proteinText").text(" | " + protein);
    $("#carbsText").text(" | " + carbs);
    $("#fatText").text(" | " + fat);

    $("#breakfast").text(breakfast);
    $("#lunch").text(lunch);
    $("#dinner").text(dinner);

    $("#dietResult").fadeIn();
});
});