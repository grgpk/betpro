### დავალება

უნდა შევქმნათ სპორტის ივენთების მართვის (Sports Event Management) აპლიკაცია შემდეგი ფუნქციონალით:

- სპორტის ივენთების სიის ნახვა (მთავარი გვერდი)
- მთავარი გვერდიდან შესაძლებელი უნდა იყოს ახალი ივენთების დამატება (უნდა იხსნებოდეს ახალ გვერდზე ან მოდალში)
- მთავარი გვერდიდან შესაძლებელი უნდა იყოს ივენთის წაშლა
- ივენთის დეტალების გვერდი (შესაძლებელი უნდა იყოს ყველა დეტალის ნახვა და რედაქტირება)
- Betslip ფუნქციონალი - შერჩეული ივენთების კალათა ფსონებისთვის
- ივენთის real-time კოეფიციენტების განახლება
- ყველა ოპერაციის შესრულების დროს უნდა მოხდეს შესაბამისი მონაცემების სტრუქტურის და მთლიანობის ვალიდაცია. შეცდომის შემთხვევაში შესაბამისი მესიჯის დაბრუნება.
- ყველა ოპერაციის შესრულების დროს უნდა მოხდეს backend სერვისის გამოძახება, http პროტოკოლით. backend-ის არჩევანი თავისუფალია (JSON Server, Memory Server და ა.შ).
- Backend-ის API-ის მისამართი უნდა იყოს გაწერილი კონფიგურაციის ფაილში
- შესაძლებელია Angular Material-ის გამოყენება

### აუცილებელი მოთხოვნები:

- აპლიკაცია უნდა დაიწეროს Angular 19+ ვერსიაზე
- ფორმების აწყობა უნდა მოხდეს Reactive Forms-ის მეშვეობით
- NgRx-ის გამოყენება state management-ისთვის
- პროექტი დაფუშეთ ამავე Repository-ში და ამ ფაილში გაწერეთ პროექტის გაშვების ინსტრუქცია

### უპირატესობა მიენიჭება:

- Pagination-ის გამოყენებას მთავარ გვერდზე
- სორტირების და ფილტრაციის შესაძლებლობას მთავარ გვერდზე (სპორტის ტიპი, სტატუსი, თარიღი)
- სორტირების, ფილტრაციისა და paging-ის პარამეტრების შენარჩუნებას გვერდის დარეფრეშების შემთხვევაში
- Betslip-ის localStorage-ში შენახვას
- Real-time კოეფიციენტების simulation (WebSocket ან interval-ებით)
- Virtual scrolling-ს დიდი სიისთვის
- Unit ტესტების იმპლემენტაციას
- Standalone Components-ის გამოყენებას

### SportEvent-ის მოდელი (ყველა ველი სავალდებულოა):

```typescript
interface SportEvent {
  id: string; // უნიკალური
  title: string; // მინ-2 მაქს-100 სიმბოლო
  description: string; // მინ-2 მაქს-200 სიმბოლო
  sport: 'football' | 'basketball' | 'tennis' | 'volleyball'; // სპორტის ტიპი
  homeTeam: string; // მინ-2 მაქს-50 სიმბოლო
  awayTeam: string; // მინ-2 მაქს-50 სიმბოლო
  startTime: Date; // ღონისძიების დროი
  status: 'upcoming' | 'live' | 'finished'; // სტატუსი
  odds: {
    home: number; // მინ-1.01 მაქს-100
    draw?: number; // არასავალდებულო (ზოგიერთ სპორტში არ არის ფრე)
    away: number; // მინ-1.01 მაქს-100
  };
  isLive: boolean; // ლაივ ივენთია თუ არა
}
```

### Bet-ის მოდელი:

```typescript
interface Bet {
  id: string;
  eventId: string;
  eventTitle: string;
  selection: 'home' | 'draw' | 'away'; // რას ირჩევს მომხმარებელი
  odds: number;
  stake?: number; // ფსონის თანხა (შეყვანის შემდეგ)
}
```

### შეფასებისას მიექცევა ყურადღება:

- **გამართული UX / UI** - სპორტსბუქისთვის შესაფერისი interface
- **პროექტის არქიტექტურას** - NgRx state management, clean architecture
- **Angular-ის უახლესი ტექნოლოგიების გამოყენებას** - Signals, Standalone Components, Control Flow
- **Reusable ელემენტების დაწერა და გამოყენება** - shared components, pipes, directives
- **Performance optimization** - OnPush strategy, trackBy functions, virtual scrolling
- **Real-time functionality** - კოეფიციენტების განახლება
- **Responsive design** - მობილური და დესკტოპი
- **Error handling** - network errors, validation errors
- **Testing coverage** - unit tests, integration tests

### Real-time ფუნქციონალის განხორციელება:

კანდიდატმა უნდა შექმნას სერვისი რომელიც სიმულირებს real-time კოეფიციენტების განახლებას:

```typescript
// მაგალითი იმპლემენტაციისთვის
@Injectable()
export class OddsUpdateService {
  
  // ყოველ 3-5 წამში შემთხვევითად იცვლება კოეფიციენტები
  startOddsSimulation(): Observable<any> {
    return timer(0, 4000).pipe( // ყოველ 4 წამში
      map(() => ({
        eventId: this.getRandomEventId(),
        newOdds: this.generateRandomOdds()
      }))
    );
  }
  
  private generateRandomOdds() {
    return {
      home: +(Math.random() * 3 + 1).toFixed(2), // 1.00-დან 4.00-მდე
      draw: +(Math.random() * 2 + 2.5).toFixed(2),
      away: +(Math.random() * 3 + 1).toFixed(2)
    };
  }
}
```

**რა უნდა აჩვენოს კანდიდატმა:**
- კოეფიციენტები UI-ში ისტემატურად იცვლება
- NgRx store ახლდება ახალი კოეფიციენტებით  
- Betslip-ში არსებული კოეფიციენტები ახლდება
- Loading states ან "updating" ინდიკატორები

### წარმატების კრიტერიუმები:

✅ **ფუნქციონალი (35%)**: ყველა მოთხოვნის იმპლემენტაცია  
✅ **ტექნიკური ხარისხი (25%)**: Angular best practices, NgRx, clean code  
✅ **UX/UI (20%)** 
✅ **Performance (15%)**: ოპტიმიზაცია, რეალურ დროში განახლებები  
✅ **ტესტირება (5%)**: unit tests, error handling

### ბონუს ქულები:

- ანიმაციები და ტრანზიციები
- Advanced filtering (date range, multiple sports)
- Bet history ფუნქციონალი
- Mobile-first responsive design
