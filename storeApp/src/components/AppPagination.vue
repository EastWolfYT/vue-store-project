<template>
    <div v-if="totalPages > 1" class="paginationCont">
        <!-- każdy przycisk paginacji to link który bierze obecne query z URL podmienia tylko _page -->
        <RouterLink v-if="currentPage > 1" :to="{ query: { ...$route.query, _page: Number(currentPage) - 1 } }"
            class="pageLink">
            Previous
        </RouterLink>

        <!-- ...$route query żeby nie zgubic name, category, _sort, _order, _limit i zmieniń tylko na stronę -->
        <RouterLink v-for="page in totalPages" :key="page" :to="{ query: { ...$route.query, _page: page } }"
            class="pageLink" :class="{ activePage: page === Number(currentPage) }">
            {{ page }}
        </RouterLink>

        <RouterLink v-if="currentPage < totalPages" :to="{ query: { ...$route.query, _page: Number(currentPage) + 1 } }"
            class="pageLink">
            Next
        </RouterLink>
    </div>
</template>

<script>
export default {
    name: "AppPagination",

    props: {
        currentPage: Number, // numer aktualnej strony
        totalItems: Number, // pełna liczba wyników
        limit: Number // limit produktów na strone
    },

    computed: {
        // ile stron trzeba pokazać
        totalPages() {
            return Math.ceil(this.totalItems / this.limit)
        }
    }
}
</script>

<style scoped>
.paginationCont {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    margin: 30px 0;
    font-family: Arial, Helvetica, sans-serif;
}

.pageLink {
    text-decoration: none;
    color: white;
    background: #333333;
    padding: 8px 14px;
    border-radius: 6px;
    transition: transform 0.2s ease, background-color 0.2s ease;
}

.pageLink:hover {
    background: #3e7eff;
    transform: scale(1.05);
}

.activePage {
    background: #3e7eff;
}
</style>