$(document).ready(function () {

    let currentIndex = 0;
    let exercises = [];
    let timerInterval;
    let totalExercises = 0;

    function getProgram() {
        return new URLSearchParams(window.location.search).get("program");
    }

    function loadWorkout() {

        let program = getProgram();

        if (!program || !programData[program]) return;

        let data = programData[program];

        $("#workoutTitle").text(data.title);

        exercises = data.exercises;
        totalExercises = exercises.length;

        showExercise();
    }

    function showExercise() {

        let ex = exercises[currentIndex];

        $("#workoutExercise").text(ex.name);
        $("#workoutImage").attr("src", ex.image);

        startTimer(30);
    }

    function startTimer(seconds) {

        clearInterval(timerInterval);

        let time = seconds;
        let totalTime = seconds;

        $("#timer").text(time);

        timerInterval = setInterval(function () {

            time--;
            $("#timer").text(time);

            // 🔥 SMOOTH PROGRESS LOGIC
            let exerciseProgress = (totalTime - time) / totalTime;
            let overallProgress = ((currentIndex + exerciseProgress) / totalExercises) * 100;

            $("#progressBar").css("width", overallProgress + "%");

            if (time <= 0) {
                nextExercise();
            }

        }, 1000);
    }

    function nextExercise() {

        if (currentIndex < exercises.length - 1) {

            currentIndex++;
            showExercise();

        } else {

            clearInterval(timerInterval);

            $("#progressBar").css("width", "100%");

            $("#workoutExercise").text("Workout Complete 🎉");
            $("#workoutImage").hide();
            $("#timer").hide();
            $("#nextBtn").hide();

            $("#finishBtn").show();
        }

    }

    $("#nextBtn").click(function () {
        nextExercise();
    });

    $("#finishBtn").click(function () {
        window.location.href = "programs.html";
    });

    loadWorkout();

});