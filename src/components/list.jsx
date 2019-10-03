import axios from 'axios';

import React, { Component } from 'react';
import Card from './card';
import ButtonCreateCard from './button-create-card';

import Firebase from '../modules/Firebase';
const Firestore = Firebase.firestore();

/**
 * initialize
 */
const urlBASE = "http://localhost:8081";

export default class List extends Component {
    constructor(props) {
        super(props)

        this.state = { projectID: null, cards: [], showNewCard: false }

        this.handleCardComplete = this.handleCardComplete.bind(this);
        this.handleCreateCard   = this.handleCreateCard.bind(this);
        this.handleCreateCardSubmit   = this.handleCreateCardSubmit.bind(this);
    }
    
    componentWillMount() {
        this.setState({ projectID: this.props.projectID });
        this.getCards(this.props.projectID);
    }


    componentWillReceiveProps(nextProps) {
        if (nextProps.projectID !== this.state.projectID) {

            /**
             * Listeyi boşaltıyoruz.
             */
            this.setState({ projectID: nextProps.projectID, cards: [] });

            /**
             * Yeni proje id ile birlikte yeni kartları seçiyoruz.
             */
            this.getCards(nextProps.projectID);
          }
    }

    render() {
        //console.log("List: " + this.state.projectID + "/" + this.props.listName);
        return (
            <div>
                <div className="container-for-cards-title list-title" >
                    <h4>{ this.props.title }</h4>
                    { 
                        (this.props.showButtonAddCard)
                        ?
                         <ButtonCreateCard onClick={this.handleCreateCard}/>
                        :
                        null
                    }
                    {
                        (this.props.showButtonAddCard)
                        ?
                        <dialog className="mdl-dialog">
                            <h4 className="mdl-dialog__title">Allow data collection?</h4>
                            <div className="mdl-dialog__content">
                                <p>Allowing us to collect data will let us get you the information you want faster.</p>
                            </div>
                            <div className="mdl-dialog__actions">
                            <button type="button" className="mdl-button">Agree</button>
                            <button type="button" className="mdl-button close">Disagree</button>
                            </div>
                        </dialog>
                        :
                        null
                    }
                </div>
                {
                    (this.state.showNewCard)
                    ?
                    <div className="mdl-card mdl-shadow--4dp card">
                        <form action="#" onSubmit={this.handleCreateCardSubmit} >
                        <div className="mdl-card__supporting-text">
                            <div className="mdl-textfield mdl-js-textfield">
                                <textarea className="mdl-textfield__input" type="text" rows= "3" id="sample5" ref={newCardContent => this.newCardContent = newCardContent} ></textarea>
                                <label className="mdl-textfield__label" htmlFor="sample5">Kart bilgileri...</label>
                            </div>
                        </div>
                        <div className="mdl-card__actions mdl-card--border">
                            <button type="submit" className="mdl-button mdl-js-button mdl-button--raised mdl-button--accent">Kaydet</button>
                        </div>
                        </form>
                    </div>
                    :
                    null
                }
                {
                    this.state.cards.map((item, i) => {
                        return <Card key={i}  showButtonComplete={this.props.showButtonComplete} callbackCardComplete={ this.handleCardComplete } data={ item } />
                    })
                }
            </div>
        )
    }

    /**
     * Child componenttei + tuşuna basıldığında
     * Yeni kart oluşturulması için komponenti gösteriyoruz.
     */
    handleCreateCard(event) {
        event.preventDefault();
        
        if (this.state.showNewCard)
            this.setState({ showNewCard: false });
        else
            this.setState({ showNewCard: true });
    }

    /**
     * Eğer kart yazılıp gönderme tuşuna basılırsa
     * Verileri burada handle ediyoruz.
     */
    handleCreateCardSubmit(event) {
        console.log("HOX",  this.newCardContent.value);

        Firestore.collection("projects").doc(this.state.projectID).collection("todo").doc()
        .set({
            content: this.newCardContent.value
        })
        .then(() => {
            this.setState({ showNewCard: false });
        })
        .catch();
        
    }

    /**
     * Herhangi bir card tamamlandı butonuna basılırsa
     * Bir sonraki listeye gönderilmesini sağlıyoruz.
     * 
     * @param {*} param 
     */
    handleCardComplete(param) {
        console.log("List button complete handle!" + param.id);
        console.log(param.data());
        
        const listSource = this.props.listName;
        let listDestination;
        
        /**
         * Hedef listeyi seçiyoruz.
         */
        if (this.props.listName === "todo") {
            listDestination = "doing";
        } else if (this.props.listName === "doing") {
            listDestination = "build";
        }

        /**
         * Kaynak listeden => hedef listeye kartı taşıyoruz.
         * Bunu yapmak için sırayla
         * 1- Kart mevcut listeden siliniyor.
         * 2- Yeni listeye ekleniyor.
         */
        const projectRef = Firestore.collection("projects").doc(this.state.projectID);

        /**
         * Silme işlemine başlıyoruz.
         */
        projectRef.collection(listSource).doc(param.id).delete().then(() => {
            console.log("Document successfully deleted!");

            /**
             * Silme başarılı
             * Kart yeni listeye ekleniyor.
             */
            projectRef.collection(listDestination).doc(param.id)
            .set({
                content: param.data().content
            })
            .then(() => {
                console.log("Document successfully written!");

                /**
                 * Eğer kart builde taşınırsa 
                 * Base app'e bidirim gönderiyoruz.
                 */
                if (listDestination == "build") {
                    axios.get(urlBASE + '/' + this.state.projectID + '/build/' + param.id + '/ready')
                    .then(response => {
                        console.log(response);
                    })
                    .catch(error => {
                        console.log(error);
                    });
                }
                
            })
            .catch((error) => {
                console.error("Error writing document: ", error);
            }); // end of write document

        }).catch(function(error) {
            console.error("Error removing document: ", error);
        }); // end of remove document

    } // end of handleCardComplete()

    /**
     * Kartları veritabanından çeker ve yeni state yeniler.
     * 
     * @param {*} projectID 
     */
    getCards(projectID) {
        Firestore.collection("projects").doc(projectID).collection(this.props.listName)
        .onSnapshot(snapshot => {
            let cardsNew = [];
            snapshot.docChanges.forEach(change => {
                if (change.type === "added") {
                    //console.log(projectID + "/" + this.props.listName + "- added card: ", change.doc.data());
                    this.setState({ cards: this.state.cards.concat(change.doc)});
                }
                if (change.type === "modified") {
                    //console.log(projectID + "/" + this.props.listName + "- modified card: ", change.doc.data());

                    /**
                     * Eski kartları push ediyoruz.
                     */
                    for (let key in this.state.cards) {
                        if (this.state.cards[key].id !== change.doc.id)
                            cardsNew.push(this.state.cards[key]);
                    }

                    /**
                     * Değişen kartı en son push ediyoruz.
                     */
                    cardsNew.push(change.doc);

                    this.setState({ cards: cardsNew });
                }
                if (change.type === "removed") {
                    //console.log(projectID + "/" + this.props.listName + "- removed card: ", change.doc.data());

                    /**
                     * Mevcut kartları gezeceğiz ardından
                     * silinmiş kart dışındakileri başka bir array üzerinde tutup
                     * state update edeceğiz.
                     */
                    for (let key in this.state.cards) {
                        if (this.state.cards[key].id !== change.doc.id)
                            cardsNew.push(this.state.cards[key]);
                    }

                    this.setState({ cards: cardsNew });
                    
                }
            });

            //console.log(this.state.cards);
            
        });    
    }
}
