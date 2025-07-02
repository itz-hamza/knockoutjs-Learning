ko.components.register('buttonComponent', {

    viewModel: function (params) {
        this.onClickFunction = params.onClickFunction;
        this.text = params.text;
    },

    template:
        `    <div class="fetchUserButton">
                <button type="button" data-bind="click: onClickFunction, text: text" ></button>  
            </div>  `

});

ko.components.register('bioData', {

    viewModel: function (params) {
        this.fullName = params.fullName;
        this.email = params.email;
        this.gender = params.gender;
        this.location = params.location;
        this.phone = params.phone;
        this.picture = params.picture;
    },
    template:
        `
            <p data-bind ="text :fullName"></p>
            <p data-bind="text: email"></p>
            <p data-bind = "text: gender"></p>
            <p data-bind = "text: location"></p>
            <p data-bind = "text: phone"></p>
            <img data-bind=" attr: { src: picture }" />
            <p><i>This person may not exist</i></p>
        `
})

class FavouriteUser {
    constructor(fullName, email, gender, location, phone, picture) {
        this.fullName = fullName;
        this.email = email;
        this.gender = gender;
        this.location = location;
        this.phone = phone;
        this.picture = picture;
    }
}

function AppViewModel() {

    let self = this;
    self.isDataFetched = ko.observable(false);
    self.fetchedData = ko.observable(null);

    self.fullName = ko.computed(function () {
        const data = self.fetchedData();
        if (data) {
            return data.name.title + " " + data.name.first + " " + data.name.last;
        }
        return ""; // Default when not yet loaded
    });
    self.email = ko.computed(function () {
        const data = self.fetchedData();
        if (data) {
            return data.email;
        }
        return ""; // Default when not yet loaded
    });

    self.gender = ko.computed(function () {
        const data = self.fetchedData();
        if (data) {
            return data.gender
        }
        return ""; // Default when not yet loaded
    })

    self.location = ko.computed(function () {
        const data = self.fetchedData();
        if (data) {
            return data.location.city + ", " + data.location.country + ", " + data.location.state;
        }
        return ""; // Default when not yet loaded
    })

    self.phone = ko.computed(function () {
        const data = self.fetchedData();
        if (data) {
            return data.phone;
        }
        return ""; // Default when not yet loaded
    })

    self.picture = ko.computed(function () {
        const data = self.fetchedData();
        if (data) {
            return data.picture.medium;
        }
        return ""; // Default when not yet loaded
    });


    self.fetchData = function () {
        console.log('Fetching data...');
        fetch('https://randomuser.me/api/')
            .then(response => response.json())
            .then(
                response => {
                    self.isDataFetched(true);
                    return response;
                }
            )
            .then((response) => {
                console.log('Data fetched successfully:', response);
                self.fetchedData(response.results[0]);
            })
    }

    self.favourites = ko.observableArray([]);

    self.addToFavourites = function () {
        // Create a new FavouriteUser from current computed observables
        const fav = new FavouriteUser(
            self.fullName(),
            self.email(),
            self.gender(),
            self.location(),
            self.phone(),
            self.picture()
        );
        self.favourites.push(fav);
    };

    self.showFavourites = ko.observable(false);

    self.clickShowFavourites = function () {
        self.showFavourites(true);
    }
    self.clickShowMainPage = function () {
        self.showFavourites(false);
    }


}

// Activates knockout.js
ko.applyBindings(new AppViewModel());