class DabeeoSelectClass {
  constructor(selectorId) {
    const id = selectorId.indexOf("#") !== -1 ? "" : "#" + selectorId;
    this.beforeSelector = document.querySelector(id);

    if (this.beforeSelector?.tagName === "SELECT") {
      const container = document.createElement("div");
      this.beforeSelector.parentNode.insertBefore(
        container,
        this.beforeSelector
      );
      container.classList.add(`dabeeo-select-${selectorId}`);
      container.appendChild(this.beforeSelector);

      this.isOpen = false;
      this.selectBox = this.tagCreate("div", "selectBox", container);
      this.listTitle = this.tagCreate("div", "listTitle", this.selectBox);
      this.selectLists = this.tagCreate("div", "selectList", this.selectBox);
      const selectBtn = this.tagCreate("div", "selectBtn", this.selectBox);
      const btnImg = this.tagCreate("img", "btnImg", selectBtn);
      btnImg.src = "img/arrow.png";

      selectBtn.addEventListener("click", this.onBtnClick);
      this.beforeSelector.style.display = "none";

      const isWidth = this.setSelectorWidth();
      if (!isWidth) {
        this.destory();
        return;
      }
      this.makeListTitle();
    } else {
      alert("올바른 태그를 입력해주세요");
    }
  }

  // create tag element
  tagCreate = (tag, className, parent) => {
    const element = document.createElement(tag);
    element.classList.add(className);
    parent.appendChild(element);

    return element;
  };

  // selector width 적용.
  setSelectorWidth = () => {
    const width = parseInt(this.beforeSelector.getAttribute("width"));

    if (isNaN(width)) {
      console.error("width값을 수정해주세요");
      return false;
    }
    this.selectBox.style.width = width + "px";
    return true;
  };

  // title setting 메소드
  setTitle = (title) => {
    this.listTitle.value = title.value;
    this.listTitle.innerText = title.innerText;
  };

  // list title 설정
  makeListTitle = () => {
    const list = [...this.beforeSelector];
    const selector = list.find((v) => v.selected);

    if (selector) {
      this.setTitle(selector);
      return;
    }
    this.setTitle(list[0]);
  };

  // list 생성
  createList = () => {
    let listFlag = false;
    const list = [...this.beforeSelector];

    list.map((option) => {
      const listItem = this.tagCreate("div", "listItem", this.selectLists);
      listItem.innerText = option.innerText;
      listItem.addEventListener("click", () => this.listItemClickEvent(option));

      if (option.selected) {
        listItem.classList.add("selected");
        listFlag = true;
      }
    });

    if (!listFlag) {
      this.beforeSelector.children[0].setAttribute("selected", "");
      this.selectLists.children[0].classList.add("selected");
    }
  };

  // list 삭제
  deleteList = () => {
    while (this.selectLists.hasChildNodes()) {
      this.selectLists.removeChild(this.selectLists.firstChild);
    }
  };

  // list item event
  listItemClickEvent = (option) => {
    if (this.beforeSelector.multiple) {
      this.multipleClickEvent(option);
      return;
    }
    const list = [...this.beforeSelector];
    const removeSelect = list.find((v) => v.selected);
    const addSelect = list.find((v) => v === option);

    this.deleteList();
    removeSelect.removeAttribute("selected");
    addSelect.setAttribute("selected", "");
    this.setTitle(option);
    this.isOpen = !this.isOpen;
  };

  multipleClickEvent = (option) => {
    if (option.selected === null || !option.selected) {
      this.multipleSelect(option, true);
      return;
    }
    if (this.beforeSelector.selectedOptions.length === 1) {
      alert("list는 무조건 1개이상 선택하셔야합니다.");
      return;
    }
    this.multipleSelect(option, false);
  };

  multipleSelect = (option, toggle) => {
    const list = [...this.selectLists.children].find(
      (child) => child.innerText === option.innerText
    );
    toggle ? list.classList.add("selected") : list.classList.remove("selected");
    toggle
      ? option.setAttribute("selected", "")
      : option.removeAttribute("selected");

    const childs = this.beforeSelector.selectedOptions;
    this.listTitle.innerText =
      childs.length > 1
        ? `${childs[0].innerText} 외 ${childs.length - 1}개`
        : childs[0].innerText;
  };

  // list btn click event
  onBtnClick = () => {
    this.isOpen = !this.isOpen;

    if (this.isOpen) {
      return this.createList();
    }
    return this.deleteList();
  };

  destory = () => {
    const parent = this.selectBox.parentNode;
    parent.removeChild(this.selectBox);
    this.beforeSelector.style.display = "block";
  };
}
